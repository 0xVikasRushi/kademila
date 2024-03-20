Kademlia - Distributed Hash Table Implementation

HashMap which store (key,value) pairs in system. what if you want to distribute this hashmap across various system

why need a need this DHT?

1. maintaining p2p network (trustless)
2. efficient in storage we can distribute data across all nodes
3. fault tolerance

Project Milestones

1. Assigning Nodes
2. Distance Metric (Which Node should own <k,v> pair ?)
3. Routing Storing Adjacent Node
4. Routing (where to find <k,v>?)
5. Store values in Single/Mutiple Nodes
6. Updating <k,v> pair if network is gone

**1 Assigning Nodes**

Each Node in network should have 160bit(20 bytes) id which should be unique

SHA-1 hashing algorithm outputs 160 bit

but for simplcity i will use 4 bits for unique id i.e 2^4=> 16 nodes

Our system can have max of 16 nodes store

**0000** (Node 0) similaritly -> **1111** (Node 15)

**2. Which Node should own <k,v> pair**

Rules for distance metric

1. d(x,x) = 0 self distance should be zero
2. d(x,y) > 0 distance should be +ve

3. d(x,y) + d(y,z) >= d(x,z) trianlge inequality

   **shortest distance between the two points is staright line connecting them**

distance metric used in kademlia is
**d(x,y) = x ^ y (XOR) which is satisy all distance metric rules**

- Lets take <k,v> pair and calculate distance between <k,v> and n0,n1.....n15 nodes
- Node with mininum distance we will store <k,v> with <Node>

**Observation : the most comman Prefix of key and shorter distance**

- Instead of building complete binary tree **(16 nodes)** building tree which has path and if you don;t find the path similar to it ignore the subtree

**3. Routing Storing Adjacent Node**

how would node 7 find what’s the value at key 13?

**Every node will have a routing table with IP addresses and IDs of at least “K” other active nodes in a prefix range**
whatttt?

Every Node will need n connection to talk where n=4 (actual n=160bits)

**4.Routing (where to find <k,v>?)**

Apply Least common ancestor Algorithm to find pairs

if key=1101 we can search in node=1110 or node=1111

https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/

**5.Store values in Single/Mutiple Nodes**

i'm confused about these section whether to store store keys in single node or mutiple node then how to avoid collison. i think i need read entire paper?
