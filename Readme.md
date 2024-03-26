# Kademlia - Distributed Hash Table Implementation

This project implementing a Kademlia Distributed Hash Table (DHT) for storing and retrieving key-value pairs across a decentralized network

This project focuses on a simplified Kademlia implementation demonstrating core concepts. While a real-world Kademlia uses 160-bit identifiers, I'm using 6 bits for easier testing (64 possible nodes).

## why need a need this DHT?

1. **Scalability** - Efficiently in storage we can distribute data across all nodes
2. **Decentralization** - maintaining p2p network (trustless)
3. **Fault Tolerance**

## Project Stages

1. Node Identification
2. Distance Metric (Which Node should own <k,v> pair ?)
3. Routing Storing Adjacent Node
4. Routing (where to find <k,v>?)
5. Store values in Nodes

## 1.Node Identification

Each node in the network receives a unique 6-bit identifier (000000 to 111111).

**In a real-world scenario, cryptographic hashing algorithms like SHA-1 would generate these unique IDs.**

## **2. Which Node should own <k,v> pair**

\*Kademlia use the XOR (^) operation to calculate the distance between node IDs. It adheres to these properties:

- `d(x, x) = 0` (distance to itself is zero)
- `d(x, y) > 0` (distance is positive)
- `d(x, y) + d(y, z) >= d(x, z)` (triangle inequality)

* This metric helps determine which node should store a key-value pair based on the key's distance to node IDs. The node with the closest distance "owns" the key-value pair.

Similarly Lets take <k,v> pair and calculate distance between <k,v> and n0,n1.....n31 nodes . Node with less distance we will store <k,v> with <Node>
**Observation : the most common Prefix of key and shorter distance**

## **3. Routing Storing Adjacent Node**

how would node 7 find what’s the value at key 13?

**Every node will have a routing table with IP addresses and IDs of at least “K” other active nodes in a prefix range**

Every Node will need n connection to talk where n=4 (actual n=160bits)

**4.Routing (where to find <k,v>?)**

Apply Least common ancestor Algorithm to find pairs

if key=1101 we can search in node=1110 or node=1111

https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/

**5.Store values in Single/Mutiple Nodes**
