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
