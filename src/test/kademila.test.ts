import axios from "axios";
import { KademilaNode } from "../kademila-node";
import { startNode } from "../utils";

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
});
