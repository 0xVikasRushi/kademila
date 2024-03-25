import axios from "axios";
import { KademilaNode } from "../kademila-node";
import { startNode } from "../utils";
import { BIT_SIZE } from "../constant";
import { FindNodeResponse, PingResponse } from "../types";

describe("Node Startup and Communication", () => {
  const nodes: KademilaNode[] = [];

  // ? Start nodes 0-15 on different ports
  beforeAll(async () => {
    for (let i = 0; i < 16; i++) {
      nodes.push(await startNode(i, 3000 + i));
    }
  });

  test("All nodes should be reachable via ping", async () => {
    for (const node of nodes) {
      const response = await axios.get(`http://localhost:${node.port}/ping`);
      expect(response.data.status).toBe(true);
    }
  });

  test("Ping another node using pingServer route", async () => {
    const targetPort = 3005;
    const response = await axios.get(
      `http://localhost:3000/pingServer/${targetPort}`,
    );
    expect(response.data.status).toBe(true);
  });

  test("Ping all servers with each other", async () => {
    for (let i = 0; i < nodes.length; i++) {
      const sourceNode = nodes[i];
      for (let j = 0; j < nodes.length; j++) {
        if (i !== j) {
          // ! self ping remove
          const targetNode = nodes[j];
          const targetPort = targetNode.port;
          const response = await axios.get(
            `http://localhost:${sourceNode.port}/pingServer/${targetPort}`,
          );

          expect(response.data.status).toBe(true);
          expect(
            response.data.msg ===
              `PING FROM ${sourceNode.id} TO PORT=${targetPort}`,
          ).toBe(true);
        }
      }
    }
  });

  test(`All Buckets should be length of ${BIT_SIZE}`, async () => {
    for (const node of nodes) {
      const response = (await axios.get(`http://localhost:${node.port}/ping`))
        .data as PingResponse;
      expect(response.buckets.length).toBe(BIT_SIZE);
    }
  });

  test("Network Map should same to all Nodes", async () => {
    const network_map = new Map<number, number>();
    const startId = nodes[0].id;
    const endId = nodes[nodes.length - 1].id;
    for (let i = startId; i < endId; i++) {
      network_map.set(nodes[i].id, nodes[i].port);
    }
    for (const node of nodes) {
      const map = node.network;
      expect(map.entries === network_map.entries).toBe(true);
    }
  });

  // ? Route from 0-> 15 i.e 0000 to 1111 will be from 8, 12, 14
  test("FindNode 15 Route from Node 0 -> Node 15", async () => {
    const expectedResult = [8, 12, 14];
    const result = (await axios.get("http://localhost:3000/findNode/15"))
      .data as FindNodeResponse;
    const route = result.route!;
    expect(expectedResult.length === route.length).toBe(true);
    for (let i = 0; i < expectedResult.length; i++) {
      const actualEle = route[i];
      const expectedEle = expectedResult[i];
      expect(actualEle === expectedEle).toBe(true);
    }
  });

  // ? Route from 15-> 0 i.e 1111 to 0000 will be from 7,3,1
  test("FindNode 15 Route from Node 0 -> Node 15", async () => {
    const expectedResult = [7, 3, 1]; // ? refer routing table
    const result = (await axios.get("http://localhost:3015/findNode/0"))
      .data as FindNodeResponse;
    const route = result.route!;
    expect(expectedResult.length === route.length).toBe(true);
    for (let i = 0; i < expectedResult.length; i++) {
      const actualEle = route[i];
      const expectedEle = expectedResult[i];
      expect(actualEle === expectedEle).toBe(true);
    }
  });
});
