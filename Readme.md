# Kademlia - Distributed Hash Table Implementation

This project implements a Kademlia Distributed Hash Table (DHT) for storing and retrieving key-value pairs across a decentralized network

This project focuses on a simplified Kademlia implementation demonstrating core concepts. While a real-world [Kademlia Paper]('https://pdos.csail.mit.edu/~petar/papers/maymounkov-kademlia-lncs.pdf') uses 160-bit identifiers, I'm using 6 bits for easier testing (32 possible nodes).

## why do we need DHT?

1. **Scalability** - Efficiently in storage we can distribute data across all nodes
2. **Decentralization** - maintaining p2p network (trustless)
3. **Fault Tolerance**

## Project Stages

1. Node Identification
2. Distance Metric (Which Node should own <k,v> pair ?)
3. Routing Storing Adjacent Node
4. Routing (where to find <k,v>?)
5. Store values in Nodes

## 1. Node Identification

Each node in the network receives a unique 6-bit identifier (000000 to 111111).

**In a real-world scenario, cryptographic hashing algorithms like SHA-1 would generate these unique IDs.**

## **2. Which Node should own <k,v> pair**

\*Kademlia uses the XOR (^) operation to calculate the distance between node IDs. It adheres to these properties:

- `d(x, x) = 0` (distance to itself is zero)
- `d(x, y) > 0` (distance is positive)
- `d(x, y) + d(y, z) >= d(x, z)` (triangle inequality)

* This metric helps determine which node should store a key-value pair based on the key's distance to node IDs. The node with the closest distance "owns" the key-value pair.

Similarly Let's take <k,v> pair and calculate the distance between <k,v> and n0,n1.....n31 nodes . Node with less distance we will store <k,v> with <Node>
**Observation: the most common Prefix of key and shorter distance**

## **3. Routing Storing Adjacent Node**

how would node 7 find what’s the value at key 13?

**Every node will have a routing table with IP addresses and IDs of at least “K” other active nodes in a prefix range**

For Example if the node identifier size is 4 bit then the total size of network 2^4 = 16

So every node should store k buckets i.e 4 buckets in this case

![kademila-pic](https://i0.wp.com/softwareengineeringdaily.com/wp-content/uploads/2018/07/Kademlia2.jpg?resize=730%2C389&ssl=1)

**So 1111 i.e 15 nodes should know 4 nodes in different subtrees with distance 1,2,4,8 so k-buckets for node 15 will be 14,13,11,7**

## **4.Routing (where to find <k,v>?)**

A node checks its k-buckets and chooses the node with the least distance to the key. It then routes the request from one node to another until it reaches the node that "owns" the <k,v> pair.

It will check for k-buckets and choose the least distance with key and routes from one node to another node

| **Peer GUID** | **2^0 = 1** | **2^1 = 2** | **2^2 = 4** | **2^3 = 8** |
| ------------- | ----------- | ----------- | ----------- | ----------- |
| **0**         | 1           | 2           | 4           | 8           |
| **1**         | 0           | 3           | 5           | 9           |
| **2**         | 3           | 0           | 4           | 10          |
| **3**         | 2           | 1           | 7           | 11          |
| **4**         | 5           | 6           | 0           | 12          |
| **5**         | 4           | 7           | 1           | 13          |
| **6**         | 7           | 4           | 2           | 14          |
| **7**         | 6           | 5           | 3           | 15          |
| **8**         | 9           | 10          | 12          | 0           |
| **9**         | 8           | 11          | 13          | 1           |
| **10**        | 11          | 8           | 14          | 2           |
| **11**        | 10          | 9           | 15          | 3           |
| **12**        | 13          | 14          | 8           | 4           |
| **13**        | 12          | 15          | 9           | 5           |
| **14**        | 15          | 12          | 10          | 6           |
| **15**        | 14          | 13          | 11          | 7           |

## 5. Store values in Nodes

Once the node that owns the <k,v> pair is identified, the value can be stored on that node. Kademlia also implements mechanisms to maintain the routing table and k-buckets as the network evolves.

## Api Reference

- GET `/api/ping`
  - Checks if the current node is reachable and current Buckets
- GET `/api/pingServer`
  - Pings a specific node by its port number
- GET `/api/get/:key`
  - Retrieves the value associated with a key from its own network.
- GET `/api/save/:key/:value`
  - Initiates storing a key-value pair in the associated node
- GET `/api/findValue/:key`
  - Locates the value of key responsible for storing a key's data.
- GET `/api/findNode/:key`
  - Finds the closest node responsible for a key (not necessarily storing the data)

## Testing

I have tested the current algorithm with 32 nodes i.e 6 Bit Node identifier, view all test cases `src/test/kademila.test.ts`

<img alt="test-result" src="https://github.com/0xVikasRushi/kademila/assets/88543171/4470d365-133f-4a34-a50d-12796b6385b2" height="50%" width="50%">
