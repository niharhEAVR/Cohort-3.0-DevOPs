## 🧩 What is Capacity Estimation?

**Capacity estimation** means figuring out how many servers, databases, or resources (CPU, memory, bandwidth, etc.) are required to handle your expected **traffic load** *while maintaining performance and uptime (SLA)*.

Think of it as:

> “If my app expects X users per second, how many servers do I need to keep response time < 200ms?”

---

## ⚙️ Why It’s Important

* You can **plan infrastructure** cost-effectively.
* Avoid **overloading** servers (crashes during spikes).
* Set up **auto-scaling** rules (add/remove servers dynamically).
* Design caching, load balancing, and database sharding strategies properly.

---

## 🧮 Step-by-Step Capacity Estimation Process

Let’s go step by step with a clear framework.

---

### **Step 1: Gather Requirements**

Understand what you’re designing for:

* Expected **number of active users**
* **Peak traffic** (during festivals, matches, etc.)
* **Requests per user per second**
* Target **SLA (Service Level Agreement)**, e.g. 99.9% uptime, <200 ms latency.

---

### **Step 2: Estimate Requests Per Second (RPS)**

👉 Formula:
$$[
\text{Total Requests per Second (RPS)} = \text{Active Users} \times \text{Requests per User per Second}
]$$

**Example:**

* 1 million daily active users (DAU)
* On average, 10% are active at peak hour = 100,000 users
* Each sends 1 request every 5 seconds → 0.2 req/s per user

$$[
\text{RPS} = 100,000 \times 0.2 = 20,000 \text{ requests/second}
]$$

---

### **Step 3: Measure Server Capacity**

Each server can handle only so many requests per second.

You can estimate by:

* Benchmarking (using tools like Apache JMeter, k6, or Locust)
* Observing existing load metrics (CPU/memory utilization)

Let’s assume:

* Each server handles **2,000 requests/sec** before hitting 70% CPU.

---

### **Step 4: Compute Number of Servers Needed**

$$[
\text{Servers Required} = \frac{\text{Total RPS}}{\text{RPS per Server}}
]$$

$$[
= \frac{20,000}{2,000} = 10 \text{ servers}
]$$

Add a **20–30% buffer** for spikes or failures:
$$[
\text{Total = 13 servers (including redundancy)}
]$$

---

### **Step 5: Consider Storage + Bandwidth**

Estimate how much **data per request** is transferred or stored.

Example:

* Each request = 100 KB
* 20,000 req/s = 2,000,000 KB/s = 2 GB/s traffic

That means you need:

* **Network capacity ≥ 2 GB/s**
* **Load balancer throughput ≥ 2 GB/s**

---

### **Step 6: Plan for Spikes (Scaling Strategy)**

Two types:

1. **Vertical Scaling (Scale Up)**
   → Add more power to a single machine (more CPU/RAM).

2. **Horizontal Scaling (Scale Out)**
   → Add more machines (distribute load via a load balancer).

Use **auto-scaling policies**:

* If CPU > 70% for 5 min → add 1 server
* If CPU < 30% for 10 min → remove 1 server

---

### **Step 7: Apply Caching and Queueing**

* **Cache (Redis, CDN)** → reduce read load.
* **Message queues (Kafka, RabbitMQ)** → smooth traffic spikes.

This helps serve **more RPS** with fewer machines.

---

## 📱 Example 1: PayTM App

Let’s say PayTM expects a **Diwali sale spike**:

| Parameter             | Value                |
| --------------------- | -------------------- |
| Peak users            | 1 million concurrent |
| Avg requests/user/sec | 0.5                  |
| Avg request size      | 150 KB               |
| One server can handle | 5,000 req/s          |

**Step 1:**
$$[
\text{RPS} = 1,000,000 \times 0.5 = 500,000 \text{ req/s}
]$$

**Step 2:**
$$[
\text{Servers} = 500,000 / 5,000 = 100 \text{ servers (plus 20% buffer = 120 servers)}
]$$

**Bandwidth:**
$$[
500,000 × 150 KB = 75 GB/s \text{ (need load balancers + CDN)}
]$$

So PayTM uses **CDNs**, **microservices**, **auto-scaling**, and **distributed databases** to maintain SLA.

---

## ♟ Example 2: Online Chess App

| Parameter                             | Value |
| ------------------------------------- | ----- |
| 200k active players                   |       |
| Each sends move every 5 s (0.2 req/s) |       |
| One server handles 2,000 req/s        |       |

$$[
\text{RPS} = 200,000 × 0.2 = 40,000 req/s
]$$
$$[
\text{Servers} = 40,000 / 2,000 = 20 servers + buffer = 25 servers
]$$

Chess servers also use:

* **WebSockets** (persistent connections)
* **Redis pub/sub** for fast updates
* **Autoscaling** to add servers when tournament traffic spikes

---

## 📊 TL;DR — Formula Summary

| Metric              | Formula                                     |
| ------------------- | ------------------------------------------- |
| Requests per second | Active users × requests/user/sec            |
| Servers required    | Total RPS ÷ server RPS                      |
| Bandwidth           | RPS × avg data/request                      |
| Storage/day         | Requests/day × data/request                 |
| Autoscaling trigger | CPU/RAM utilization or request queue length |
