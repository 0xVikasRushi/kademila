import * as Mathjs from "mathjs";
import { BIT_SIZE } from "./constant";
import { KademilaNode } from "./kademila-node";

// * Create a mask with all bits set except MSB using bitwise operations
// * Perform bitwise AND between key and mask for hashing
export const HASH_BIT_SIZE = (key: number) => {
  const mask: number = (1 << (Math.pow(2, BIT_SIZE) - 1)) - 1;
  return key & mask;
};

export const XOR = (n1: number, n2: number) => {
  return Mathjs.bitXor(Mathjs.bignumber(n1), Mathjs.bignumber(n2));
};

export async function startNode(id: number, port: number) {
  const node = new KademilaNode(id, port);
  await node.start();
  return node;
}

export function getIdealDistance() {
  const IDEAL_DISTANCE: number[] = [];
  for (let i = 0; i < BIT_SIZE; i++) {
    const val = Math.pow(2, i);
    IDEAL_DISTANCE.push(val);
  }
  return IDEAL_DISTANCE;
}

// * Experimental Distance with Hex
export function distance(nodeId1: string, nodeId2: string): number {
  const buffer1 = Buffer.from(nodeId1, "hex");
  const buffer2 = Buffer.from(nodeId2, "hex");
  let result = 0;
  for (let i = 0; i < buffer1.length; i++) {
    result ^= buffer1[i] ^ buffer2[i];
  }
  return result;
}

// ! NOTE: Dumb way probability will no distributed evenly
export function generateRandomBN(): string {
  let binaryNumber = "";
  for (let i = 0; i < BIT_SIZE; i++) {
    const bit = Math.random() < 0.5 ? "0" : "1";
    binaryNumber += bit;
  }
  return binaryNumber;
}
