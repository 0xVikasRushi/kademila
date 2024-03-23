import * as Mathjs from "mathjs";
import { XOR, generateRandomBN } from "./utils";

export class KademilaNode {
  public id: string;
  public map: Map<string, string>;
  public network: string[];

  constructor() {
    this.id = generateRandomBN();
    this.network = [];
    this.map = new Map<string, string>();
  }

  public PUT(key: string, value: string) {
    this.map.set(key, value);
  }

  public GET(key: string) {
    return this.map.get(key);
  }
  public FIND_NODE(targetID: string) {
    return targetID;
  }

  public FIND_DISTACE_IN_ALL(key: string) {
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
}

const node1 = new KademilaNode();
const node2 = new KademilaNode();
const node3 = new KademilaNode();
const node4 = new KademilaNode();

console.log(node1.network);
node1.network.push(node1.id, node2.id, node3.id, node4.id);

console.log(node1.FIND_DISTACE_IN_ALL("0001"));
