import { KademilaNodeInterface } from "./types";
import { generateRandomBN } from "./utils";

export class KademilaNode implements KademilaNodeInterface {
  public id: string;
  public map: Map<string, string>;

  constructor() {
    this.id = generateRandomBN();
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
}
