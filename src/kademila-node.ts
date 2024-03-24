import cors from "cors";
import express, { Request, Response } from "express";
import * as Mathjs from "mathjs";
import { NodeState } from "./types";
import { XOR, getIdealDistance } from "./utils";
import axios from "axios";

export class KademilaNode {
  public id: number;
  private map: Map<number, string>;
  public network: string[];
  private NodeState: NodeState = NodeState.ONLINE;
  public k_buckets: number[] = [];

  public ip: string = "localhost";
  public port: number;

  constructor(id: number, port: number) {
    this.id = id;
    this.network = [];
    this.port = port;
    this.map = new Map<number, string>();
    this.NodeState = NodeState.OFFLINE;
  }

  public STORE(key: number, value: string) {
    // TODO 1 HASH KEY IN BIT SIZE AND CHECK IF NODE IS ONLINE OR NOT
    // TODO 2 IF CONTAINS KEY PRINT
    const isContains = this.k_buckets.filter((e) => {
      return e === key;
    });
    console.log(isContains);
    this.map.set(key, value);
  }

  public start() {
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
            msg: `Kademila Running on ${this.id}`,
          })
          .status(200);
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

      this.NodeState = NodeState.ONLINE;
      this.k_buckets = this.init();
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

  public init() {
    const node_id = this.id;
    const IDEAL_DISTANCE = getIdealDistance();
    const k_bucket_without_ping = [];
    for (let i = 0; i < IDEAL_DISTANCE.length; i++) {
      const res = node_id ^ IDEAL_DISTANCE[i];
      k_bucket_without_ping.push(res);
    }
    return k_bucket_without_ping;
  }

  public FIND_DISTANCE_IN_ALL(key: string) {
    let min = Mathjs.bignumber(0);
    let networkId = Mathjs.bignumber(0);
    for (let i = 0; i < this.network.length; i++) {
      const xorRes = XOR(this.network[i], key);
      if (Mathjs.smaller(min, xorRes)) {
        min = xorRes;
        networkId = Mathjs.bignumber(this.network[i]);
      }
    }
    return { distance: min, networkid: networkId };
  }

  public PING() {
    return this.NodeState;
  }
  public getNodeState() {
    return this.NodeState;
  }
  public FIND_VALUE() {}
}
