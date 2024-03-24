import * as Mathjs from "mathjs";
import { BIT_SIZE } from "./constant";

export const XOR = (n1: string, n2: string): Mathjs.BigNumber => {
  return Mathjs.bitXor(Mathjs.bignumber(n1), Mathjs.bignumber(n2));
};

export function generateRandomBN(): string {
  let binaryNumber = "";
  for (let i = 0; i < BIT_SIZE; i++) {
    const bit = Math.random() < 0.5 ? "0" : "1";
    binaryNumber += bit;
  }
  return binaryNumber;
}

export function getIdealDistance() {
  const IDEAL_DISTANCE = [];
  for (let i = 0; i < BIT_SIZE; i++) {
    const val = Math.pow(2, i);
    IDEAL_DISTANCE.push(val);
  }
  return IDEAL_DISTANCE;
}
export function distance(nodeId1: string, nodeId2: string): number {
  const buffer1 = Buffer.from(nodeId1, "hex");
  const buffer2 = Buffer.from(nodeId2, "hex");
  let result = 0;
  for (let i = 0; i < buffer1.length; i++) {
    result ^= buffer1[i] ^ buffer2[i];
  }
  return result;
}
// const a = randomBytes(20);
// const b = randomBytes(20);

// console.log(a.toString());
// console.log(b.toString());
// console.log(distance("1111", "0000"));
