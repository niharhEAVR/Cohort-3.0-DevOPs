### Run this both files parrally and check how much time does they take for counting 1 to 1 trillion !!!


---
---
---

### Explanation of the parallel-cluster code

This TypeScript code uses **Node.js cluster module** to parallelize a computation-heavy task. Let’s break it down **line by line** and **explain how it works** in detail.

---

# **Overview**
- The goal of this code is to **sum numbers up to 1 trillion** (`1_000_000_000_0`).
- Since JavaScript is **single-threaded**, this would normally take **a very long time**.
- Instead, **we divide the work among multiple CPU cores** (parallel processing) using **the Node.js cluster module**.
- The primary process **spawns multiple worker processes**. Each worker **calculates a part of the sum**, and the results are collected to get the final total.

---

## **Step-by-Step Explanation**
### **1️⃣ Import Required Modules**
```typescript
import cluster from "cluster";
import * as os from "os";
```
- `cluster`: Used to create multiple worker processes.
- `os`: Used to get the number of CPU cores.

---

### **2️⃣ Determine CPU Count & Target Number**
```typescript
const totalCPUs: number = os.cpus().length;
const target: number = 1_000_000_000_0; // 1 trillion
```
- `totalCPUs`: Stores the number of CPU cores available on the machine.
- `target`: The number up to which we want to sum (`1 trillion`).

**💡 Why Use Multiple Cores?**  
- If we use **only one thread**, JavaScript will take **a long time** to compute the sum.
- By using **multiple worker processes**, each CPU core will calculate a portion of the sum, **making the computation much faster**.

---

### **3️⃣ Check if Process is Primary (Main)**
```typescript
if (cluster.isPrimary) {
```
- In a **clustered Node.js application**, there are two types of processes:
  1. **Primary Process** (also called "Master"): Controls worker processes.
  2. **Worker Processes**: Perform the actual computation.

**💡 How Does This Work?**  
- `cluster.isPrimary` is `true` for the **main process**.
- If true, the **primary process will create worker processes** to do the actual computation.

---

### **4️⃣ Start the Primary Process**
```typescript
console.log(`Primary ${process.pid} is running`);
console.log(`Forking ${totalCPUs} worker processes...`);
```
- The **primary process** logs its process ID (`process.pid`).
- It prints how many worker processes it will create (**equal to the number of CPU cores**).

---

### **5️⃣ Start Timer & Initialize Variables**
```typescript
const startTime: number = Date.now();
let completedWorkers: number = 0;
let totalSum: number = 0;
```
- `startTime`: Stores the current timestamp to calculate execution time later.
- `completedWorkers`: Counts how many workers have finished their tasks.
- `totalSum`: Stores the total sum calculated from all workers.

---

### **6️⃣ Fork Worker Processes**
```typescript
for (let i = 0; i < totalCPUs; i++) {
  const worker = cluster.fork();
  const start = i * (target / totalCPUs);
  const end = (i + 1) * (target / totalCPUs);

  worker.send({ start, end });
```
- A `for` loop **creates multiple worker processes** (one for each CPU core).
- `cluster.fork()` **spawns a new worker process**.
- **Each worker gets a portion of the sum calculation:**
  - `start`: Starting number for this worker.
  - `end`: Ending number for this worker.
- The primary process sends these values (`start` and `end`) to each worker using `worker.send({ start, end })`.

**💡 Why Divide the Task?**
- Instead of one process summing **1 to 1 trillion**, we divide it into smaller chunks.
- If we have **4 CPU cores**, each worker will compute:
  - **Worker 1:** `1 to 250 billion`
  - **Worker 2:** `250 billion to 500 billion`
  - **Worker 3:** `500 billion to 750 billion`
  - **Worker 4:** `750 billion to 1 trillion`
- This makes the computation **much faster**.

---

### **7️⃣ Listen for Messages from Workers**
```typescript
worker.on("message", (message: { sum: number }) => {
  console.log(`Worker ${worker.process.pid} completed. Partial Sum: ${message.sum}`);
  totalSum += message.sum;
  completedWorkers++;

  if (completedWorkers === totalCPUs) {
    const endTime: number = Date.now();
    console.log(`Parallel (Cluster) Total Sum: ${totalSum}`);
    console.log(`Parallel (Cluster) total time: ${endTime - startTime} ms`);
    process.exit();
  }
});
```
- When a worker **finishes its task**, it sends the result (`sum`) back to the primary process.
- The primary process **collects and adds the sum** to `totalSum`.
- It increments `completedWorkers` to keep track of how many workers finished.
- Once **all workers are done**, it:
  1. Calculates total execution time.
  2. Logs the **final sum**.
  3. Logs the **total execution time**.
  4. Calls `process.exit()` to stop execution.

---

### **8️⃣ Handle Worker Exit**
```typescript
worker.on("exit", (code) => {
  console.log(`Worker ${worker.process.pid} exited with code ${code}`);
});
```
- When a worker **exits**, it logs a message with its process ID and exit code.
- Exit code `0` means **successful completion**.

---

## **🔹 Worker Process Code (Handles the Computation)**
```typescript
} else {
  process.on("message", (message: { start: number; end: number }) => {
```
- If the process **is not primary**, it’s a **worker**.
- It listens for a message from the primary process (`process.on("message")`).

---

### **9️⃣ Perform the Computation**
```typescript
let count: number = 0;
for (let i = message.start; i < message.end; i++) {
  count += i;
}
```
- The worker **calculates the sum for its assigned range** (`start` to `end`).
- It does this in a `for` loop, adding up numbers.

---

### **🔟 Send Result Back to Primary**
```typescript
console.log(`Worker ${process.pid} sending sum: ${count}`);
process.send?.({ sum: count });
```
- The worker **logs** the computed sum.
- It **sends** the computed sum back to the primary process.

---

### **1️⃣1️⃣ Ensure the Worker Has Time to Send the Message**
```typescript
setTimeout(() => process.exit(), 100);
```
- A **small delay** is added before exiting (`setTimeout`).
- This ensures the message reaches the primary process **before the worker exits**.

---

## **💡 How This Solves Horizontal Scaling**
🚀 **Normal JavaScript (Single-Threaded)**
```typescript
const target = 1_000_000_000_0;
let count = 0;
for (let i = 0; i < target; i++) {
  count += i;
}
console.log(`Total Sum: ${count}`);
```
- **Problem:** Runs on a **single thread** → **Very slow** ❌

⚡ **This Cluster Code (Multi-Process)**
- **Each CPU core runs a worker process**.
- **Divides the computation into smaller tasks** → **Faster execution** ✅
- **Uses all available CPU cores**.

---

## **🔹 Summary**
| Feature             | Single-Threaded JS | Clustered JS |
|---------------------|-------------------|-------------|
| CPU Usage          | ❌ Uses only 1 CPU core | ✅ Uses all CPU cores |
| Performance        | ❌ Slow | ✅ Much Faster |
| Handles Large Tasks | ❌ Not Efficient | ✅ Efficient |

---

## **🚀 Run It**
```bash
bun .\comparison\parallel-cluster.ts
```
Now you will see multiple workers handling the computation in **parallel** and finishing much faster!

Let me know if you have any doubts! 😃🔥