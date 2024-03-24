import axios from "axios";
import { KademilaNode } from "./kademila-node";

// const bootStrap = new KademilaNode(0, 3000);
// bootStrap.start();

// Define BIT_SIZE constant (assuming 4 for this example)

async function main() {
  // Create multiple node instances with unique IDs and ports
  const nodes: KademilaNode[] = [];
  const bootStrap = new KademilaNode(0, 3000);
  bootStrap.start();
  for (let i = 1; i < 16; i++) {
    const nodeId = i;
    const port = 3000 + i;
    const node = new KademilaNode(nodeId, port);
    nodes.push(node);
  }

  await Promise.all(nodes.map((node) => node.start()));

  const key = 10;
  const value = "This is a test value";

  console.log(`Storing value "${value}" with key ${key} on node 0`);
  await axios.get(`http://localhost:3000/save/${key}/${value}`);

  //   http://localhost:3004/save/13/vikasrushi
  //   for (let i = 1; i < nodes.length; i++) {
  //     const result = await nodes[i].FIND_VALUE(key);
  //     if (result) {
  //       console.log(
  //         `Node ${i} found value: "${result.value}" (node ID: ${result.node_id})`,
  //       );
  //     } else {
  //       console.log(`Node ${i} did not find the value for key ${key}`);
  //     }
  //   }
}

main().catch((error) => {
  console.error("Error:", error);
});
