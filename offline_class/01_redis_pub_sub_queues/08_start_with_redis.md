# 🚀 Step 1 — Easiest Way: Run Redis with Docker (Recommended for You)

Since you already use Docker in your backend deployments 👌

### Run Redis locally:

```bash
docker run --name redis -p 6379:6379 -d redis
```

Check if it’s running:

```bash
docker ps
```

Test it:

```bash
docker exec -it redis redis-cli
```

Inside CLI:

```bash
SET name Nihar
GET name
```

If it returns `Nihar` → Redis is working.

---

# 🧠 Step 2 — Connect Redis in Node.js

Install Redis client:

```bash
npm install redis
```

Create `redis.ts`:

```ts
import { createClient } from "redis";

export const redis = createClient({
  url: "redis://localhost:6379"
});

redis.on("error", (err) => console.log("Redis Error", err));

await redis.connect();
```

Now test:

```ts
await redis.set("user:1", "Nihar");
const value = await redis.get("user:1");
console.log(value);
```

Done. You are now connected.

---

# 🔥 Step 3 — Use Redis as Cache (Realistic Use Case)

Example:

```ts
async function getUser(userId: string) {
  const cached = await redis.get(`user:${userId}`);

  if (cached) {
    console.log("From Redis");
    return JSON.parse(cached);
  }

  console.log("From DB");
  const user = await prisma.user.findUnique({ where: { id: userId } });

  await redis.set(`user:${userId}`, JSON.stringify(user), {
    EX: 60 // expires in 60 seconds
  });

  return user;
}
```

This is real production caching pattern.

---

# 🔥 Step 4 — Use Redis for Pub/Sub (For Your WebSocket App)

Publisher:

```ts
await redis.publish("room-1", JSON.stringify({ msg: "Hello" }));
```

Subscriber:

```ts
const subscriber = redis.duplicate();
await subscriber.connect();

await subscriber.subscribe("room-1", (message) => {
  console.log("Received:", message);
});
```

This solves your multi-server WebSocket scaling problem.

---

# 🔥 Step 5 — Use Redis as Queue (Background Job)

Simple queue:

Producer:

```ts
await redis.lPush("jobs", JSON.stringify({ type: "email", userId: 1 }));
```

Worker:

```ts
while (true) {
  const job = await redis.brPop("jobs", 0);
  console.log("Processing:", job);
}
```

That’s basic queue behavior.

In production you'd use:

* BullMQ (built on Redis)
* For retries
* Delayed jobs
* Priority queues

---

# 🏗 Step 6 — Running Redis on EC2 Properly

If deploying:

### Option 1 (Basic)

Install directly:

```bash
sudo apt update
sudo apt install redis-server
```

Edit config:

```bash
sudo nano /etc/redis/redis.conf
```

Change:

```
supervised systemd
```

Restart:

```bash
sudo systemctl restart redis
```

---

### Option 2 (Better for Production)

Use:

AWS ElastiCache (Managed Redis)

Benefits:

* Auto failover
* Replication
* Monitoring
* Backups
* No EC2 management

---

# 🎯 What Should YOU Learn First?

Since you're building:

* WebSocket rooms
* Multi-user real-time systems
* Auto-scaling servers

You should learn Redis in this order:

1️⃣ Basic GET/SET
2️⃣ TTL (expire)
3️⃣ Hashes
4️⃣ Pub/Sub
5️⃣ Distributed caching
6️⃣ Queue with BullMQ

---

# 🧠 Important Mental Shift

Redis is not:

> “Just another database”

It is:

> “Performance and coordination layer”

If your system grows:

You will need Redis.

It is almost mandatory for serious backend systems.
