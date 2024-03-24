import { BIT_SIZE } from "./constant";
import { KademilaNode } from "./kademila-node";

for (let i = 1; i < Math.pow(2, BIT_SIZE); i++) {
  const node = new KademilaNode(i, 3000 + i);
  node.start();
}
