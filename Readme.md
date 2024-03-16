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
5. Store values in Single Nodes
6. Storing k adjacent subtrees in Each Node
7. Find paths for <k,v> pair
8. Updating <k,v> pair if network is gone

**1 Assigning Nodes**

Each Node in network should have 160bit(20 bytes) id which should be unique

SHA-1 hashing algorithm outputs 160 bit

but for simplcity i will use 4 bits for unique id i.e 2^4=> 16 nodes

Our system can have max of 16 nodes store

**0000** (Node 0) similaritly -> **1111** (Node 15)

**2. Which Node should own <k,v> pair**

Rules for distance metric

d(x,x) = 0 self distance should be zero
d(x,y) > 0 distance should be +ve

d(x,y) + d(y,z) >= d(x,z) trianlge inequality
**shortest distance between the two points is staright line connecting them **

distance metric used in kademlia is
**d(x,y) = x ^ y (XOR) which is satisy all distance metric rules**

- Lets take <k,v> pair and calculate distance between <k,v> and <n0>,<n1>.....<n15> nodes
- Node with mininum distance we will store <k,v> with <Node>

**Observation : the most comman Prefix of key and shorter distance**

- Instead of building complete binary tree **(16 nodes)** building tree which has path and if you don;t find the path similar to it ignore the subtree

**3. Routing Storing Adjacent Node**

Every Node knows at least One Node in each subtree that if is not part of
