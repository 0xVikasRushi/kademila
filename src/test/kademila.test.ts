import axios from "axios";
import { BIT_SIZE, PORT_NUMBER } from "../constant";
import { KademilaNode } from "../kademila-node";
import { FindNodeResponse, PingResponse, SaveValueResponse } from "../types";
import { startNode } from "../utils";

describe("Node Startup and Communication", () => {
  const nodes: KademilaNode[] = [];

  // ? Start nodes 0-15 on different ports
  beforeAll(async () => {
    for (let i = 0; i < Math.pow(2, BIT_SIZE); i++) {
      const node = await startNode(i, PORT_NUMBER + i);
      nodes.push(node);
    }
  });

  test("All nodes should be reachable via ping", async () => {
    for (const node of nodes) {
      const response = await axios.get(`http://localhost:${node.port}/ping`);
      expect(response.data.status).toBe(true);
    }
  });

  test("Ping another node using pingServer route", async () => {
    const targetPort = PORT_NUMBER + 5;
    const response = await axios.get(
      `http://localhost:${PORT_NUMBER}/pingServer/${targetPort}`,
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
  test("FindNode 0 Route from Node 0 -> Node 15", async () => {
    const expectedResult = [8, 12, 14];
    const result = (
      await axios.get(`http://localhost:${PORT_NUMBER}/findNode/15`)
    ).data as FindNodeResponse;
    const route = result.route!;
    expect(expectedResult.length === route.length).toBe(true);
    for (let i = 0; i < expectedResult.length; i++) {
      const actualEle = route[i];
      const expectedEle = expectedResult[i];
      expect(actualEle === expectedEle).toBe(true);
    }
  });

  // ? Route from 15-> 0 i.e 1111 to 0000 will be from 7,3,1
  test("FindNode 15 Route from Node 15 -> Node 0", async () => {
    const expectedResult = [7, 3, 1]; // ? refer routing table
    const result = (
      await axios.get(`http://localhost:${PORT_NUMBER + 15}/findNode/0`)
    ).data as FindNodeResponse;
    const route = result.route!;
    expect(expectedResult.length === route.length).toBe(true);
    for (let i = 0; i < expectedResult.length; i++) {
      const actualEle = route[i];
      const expectedEle = expectedResult[i];
      expect(actualEle === expectedEle).toBe(true);
    }
  });

  test("Save/Find Key in Self Node from Self Node", async () => {
    for (const node of nodes) {
      const value = "test-1" + node.id.toString();
      await axios.get(
        `http://${node.ip}:${node.port}/save/${node.id}/${value}`,
      );
    }
    for (const node of nodes) {
      const value = "test-1" + node.id.toString();
      const result = (
        await axios.get(`http://${node.ip}:${node.port}/get/${node.id}`)
      ).data as SaveValueResponse;
      expect(value === result.value!).toBe(true);
    }
  });

  // ! saving keys from single server and fetching values in corresponding node_id servers
  test("Save/Find Key in Self Node from Random Node", async () => {
    for (const node of nodes) {
      const randomPort = PORT_NUMBER + 6;
      const value = "test-2" + node.id.toString();
      await axios.get(
        `http://${node.ip}:${randomPort}/save/${node.id}/${value}`,
      );
    }
    for (const node of nodes) {
      const value = "test-2" + node.id.toString();
      const result = // !
        (await axios.get(`http://${node.ip}:${node.port}/get/${node.id}`))
          .data as SaveValueResponse;
      expect(value === result.value!).toBe(true);
    }
  });

  test("Save Key and Find Key From AnyWhere", async () => {
    const randomPort = PORT_NUMBER + 3;
    const value = "test-3";
    const id = 10;
    await axios.get(`http://localhost:${randomPort}/save/${id}/${value}`);

    for (const node of nodes) {
      const result = (
        await axios.get(`http://${node.ip}:${node.port}/findValue/${id}`)
      ).data as SaveValueResponse;
      expect(value === result.value!).toBe(true);
    }
  });
  // ? Save value in first node to last node and fetch value from last node
});
