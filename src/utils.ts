import { BIT_SIZE } from "./constant";

export const XOR = (n1: string, n2: string) => {
  return parseInt(n1, 2) ^ parseInt(n2, 2);
};

export function generateRandomBN(): string {
  let binaryNumber = "";
  for (let i = 0; i < BIT_SIZE; i++) {
    const bit = Math.random() < 0.5 ? "0" : "1";
    binaryNumber += bit;
  }
  return binaryNumber;
}
