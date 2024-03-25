import axios from "axios";
import { KademilaNode } from "../kademila-node";
import { startNode } from "../utils";
import { BIT_SIZE } from "../constant";
import { PingResponse } from "../types";

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
});
