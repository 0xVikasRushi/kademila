import axios from "axios";
import cors from "cors";
import express, { Request, Response } from "express";
import { BIT_SIZE } from "./constant";
import {
  FindNodeResponse,
  NodeState,
  PingResponse,
  RoutingTable,
  SaveValueResponse,
} from "./types";
import { HASH_BIT_SIZE, getIdealDistance } from "./utils";

export class KademilaNode {
  // ! PUBLIC STATE
  public id: number;
  public ip: string = "localhost";
  public port: number;
  public k_buckets: number[] = [];
  public routing_table: RoutingTable[] = [];

  // * LIST OF NODEID AND PORTS
  public network: Map<number, number>;

  // ! PRIVATE STATE
  private NodeState: NodeState = NodeState.ONLINE;
  private map: Map<number, string>;

  constructor(id: number, port: number) {
    this.id = id;
    this.network = new Map<number, number>();
    this.port = port;
    this.map = new Map<number, string>();
    this.NodeState = NodeState.OFFLINE;
  }

  // ? can be used by own node instance by api call
  private SAVE(key: number, value: string) {
    // TODO 1 HASH KEY IN BIT SIZE AND CHECK IF NODE IS ONLINE OR NOT
    // TODO 2 IF CONTAINS KEY PRINT
    this.map.set(key, value);
  }

  private hashKey(key: number): number {
    return HASH_BIT_SIZE(key);
  }
  public start() {
    this.NodeState = NodeState.ONLINE;
    this.k_buckets = this.init();
    console.log(this.id, this.k_buckets);

    try {
      const app = express();

      app.use(express.json());
      app.use(cors());
      app.get("/", (req: Request, res: Response) => {
        return res.send(`Kademila Running on ${this.id}`);
      });

      app.listen(this.port, this.ip, () => {
        console.log(`Kademila Running on ${this.id}`);
      });

      app.get("/ping", async (req: Request, res: Response) => {
        return res
          .json({
            status: true,
            buckets: this.k_buckets,
            msg: `Kademila Running on ${this.id}`,
          })
          .status(200);
      });

      app.get("get/:key", async (req: Request, res: Response) => {
        const key = parseInt(req.params.key);
        const value = this.GET(key);
        if (value) {
          return res.send({ value, found: true });
        }
        return res.send({ found: false, value: null });
      });

      app.get("/pingserver/:port", async (req: Request, res: Response) => {
        try {
          const port = req.params.port as string;
          let result = await axios.get(`http://${this.ip}:${port}/ping`);
          result = result.data.status;
          console.log(result);
          return res
            .json({
              status: result,
              msg: `PING FROM ${this.id} TO ${port}`,
            })
            .status(200);
        } catch (error) {
          res.send(error);
        }
      });

      app.get("/findNode/:nodeId", async (req: Request, res: Response) => {
        const nodeId = parseInt(req.params.nodeId);
        if (nodeId > Math.pow(2, BIT_SIZE)) {
          console.log(nodeId);
          return res
            .status(200)
            .json({ found: false, error: "nodeId not found" });
        }

        const currBuckets = this.k_buckets;
        try {
          console.log(currBuckets, nodeId);
          const result = await this.FIND_NODE(nodeId, currBuckets);
          return res.json(result);
        } catch (error) {
          console.error("Error finding node:", error);
          res.status(500).send({ error: "Internal server error" });
        }
      });

      app.get("/findValue/:key", async (req: Request, res: Response) => {
        const hashKey = this.hashKey(parseInt(req.params.key));
        const value = await this.FIND_VALUE(hashKey);
        if (value) {
          return res.send({ value, found: true });
        } else {
          return res.send({ found: false });
        }
      });

      app.get("/save/:key/:value", async (req: Request, res: Response) => {
        try {
          const key = HASH_BIT_SIZE(parseInt(req.params.key));
          const value = req.params.value as string;

          if (key == this.id) {
            this.SAVE(key, value);
            return res.send({
              status: "SAVED",
              msg: `saved at node id ${this.id}:${this.port}`,
            });
          }
          const port = this.network.get(key);
          await axios.get(`http://${this.ip}:${port}/save/${key}/${value}`);

          console.log(`FORWARD at node id ${this.id}:${port}`);
          return res.send({
            status: "FORWARD",
            msg: `FORWARD at node id ${this.id}`,
          });
        } catch (error) {
          res.send({ error });
        }
      });
    } catch (error) {
      this.NodeState = NodeState.OFFLINE;
      console.log(error);
    }
  }

  public stop() {
    this.NodeState = NodeState.OFFLINE;
  }

  public GET(key: number) {
    return this.map.get(key);
  }

  private async PING_EXTERNAL(node_id: number) {
    const network_port = this.network.get(node_id);
    const result = await axios.get(`http://${this.ip}:${network_port}/ping`);
    return (result.data as PingResponse).buckets;
  }

  public async FIND_VALUE(key: number): Promise<{
    value: string;
    node_id: number;
  } | null> {
    const hash_key = this.hashKey(key);

    const value = this.map.get(hash_key);
    if (value!) {
      return Promise.resolve({ value, node_id: this.id });
    }
    const wanted_node_id = (await this.FIND_NODE(hash_key, this.k_buckets))
      .nodeId!;

    const wanted_port = this.network.get(wanted_node_id);

    const result = (await axios.get(
      `http://${this.ip}:${wanted_port}/get/${hash_key}`,
    )) as SaveValueResponse;

    if (result.found) {
      return Promise.resolve({ value: result.value!, node_id: wanted_node_id });
    }
    return null;
  }
  public async FIND_NODE(
    nodeId: number,
    buckets: number[],
  ): Promise<FindNodeResponse> {
    for (const bucketNode of buckets) {
      if (bucketNode === nodeId) {
        return { found: true, nodeId: bucketNode };
      }
    }

    let closestNode = -1;
    let minXorDistance = Infinity;

    for (const bucketNode of buckets) {
      const xorDistance = nodeId ^ bucketNode;
      if (xorDistance < minXorDistance) {
        minXorDistance = xorDistance;
        closestNode = bucketNode;
      }
    }

    if (closestNode !== -1) {
      try {
        const externalBuckets = await this.PING_EXTERNAL(closestNode);
        console.log(`Ping External Services node ${closestNode}`);
        return await this.FIND_NODE(nodeId, externalBuckets);
      } catch (error) {
        console.error(`Error pinging external node ${closestNode}:`, error);
        return { found: false, error: "External node communication error" };
      }
    }

    return { found: false, error: "Node not found in k-buckets" };
  }

  public init() {
    const node_id = this.id;
    const IDEAL_DISTANCE = getIdealDistance();
    const PORT_NUMBER = 3000;

    const k_bucket_without_ping: number[] = [];
    for (let i = 0; i < IDEAL_DISTANCE.length; i++) {
      const res = (node_id ^ IDEAL_DISTANCE[i]) as number;
      k_bucket_without_ping.push(res);
    }

    for (let i = 0; i < Math.pow(2, BIT_SIZE); i++) {
      this.network.set(i, PORT_NUMBER + i);
    }

    return k_bucket_without_ping;
  }
}
