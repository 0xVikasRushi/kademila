import { KademilaNode } from "./kademila-node";

// ? BIT_SIZE constant (assuming 4 for this example)

async function main() {
  // ! Create multiple node instances with unique IDs and ports
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
}

main().catch((error) => {
  console.error("Error:", error);
});
