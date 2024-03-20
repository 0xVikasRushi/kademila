export interface KademilaNodeInterface {
  id: string;
  map: Map<string, string>;
  PUT: (key: string, value: string) => void;
  GET: (key: string) => string;
  FIND_NODE: (targetId: string) => string;
}
