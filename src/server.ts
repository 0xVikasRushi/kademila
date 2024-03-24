import { BIT_SIZE } from "./constant";
import { KademilaNode } from "./kademila-node";

// ! INIT ALL NODES
const bootStrap = new KademilaNode(0, 3000);
bootStrap.start();
for (let i = 1; i < Math.pow(2, BIT_SIZE); i++) {
  const node = new KademilaNode(i, bootStrap.port + i);
  node.start();
  console.log(node.k_buckets, node.port);
}
