# 🟥 First: Why Persistence Is Needed?

Redis stores everything in RAM.

If:

```
Redis EC2 crashes
```

Without persistence:

```
All data = 💀 Gone
```

So Redis provides **two persistence mechanisms**:

1. **RDB (Snapshotting)**
2. **AOF (Append Only File)**

They solve the same problem in different ways.

---

# 🟡 1️⃣ RDB (Redis Database Snapshot)

### 🧠 What It Does

RDB takes a **full snapshot of memory at a specific point in time** and saves it to disk as a binary file.

Think of it like:

> Taking a photograph of your entire Redis memory.

---

## 📦 How It Works

You configure:

```
save 900 1
```

Meaning:

* If at least 1 key changed in 900 seconds → take snapshot.

Or:

```
save 60 1000
```

If 1000 keys changed in 60 seconds → snapshot.

---

## 🧱 Internally

When snapshot happens:

1. Redis forks a child process.
2. Child writes memory state to `dump.rdb`.
3. Parent continues serving requests.
4. Snapshot completes.

Forking ensures no blocking.

---

## 🔥 What Happens on Restart?

When Redis restarts:

* It loads `dump.rdb`
* Memory is restored to last snapshot state.

---

## ⚠️ Limitation

If Redis crashes:

You lose all changes since last snapshot.

Example:

Snapshot at 10:00 PM
Crash at 10:05 PM

You lose 5 minutes of data.

---

## 🟢 Pros of RDB

* Very fast recovery
* Compact file
* Low runtime overhead
* Good for backups

## 🔴 Cons

* Possible data loss between snapshots
* Not good for very critical real-time data

---

# 🔵 2️⃣ AOF (Append Only File)

Now this is more durable.

### 🧠 What It Does

Instead of snapshotting full memory,

Redis logs every write command to a file.

Example:

If you run:

```
SET name Nihar
INCR counter
LPUSH jobs task1
```

Redis writes to file:

```
SET name Nihar
INCR counter
LPUSH jobs task1
```

This file is called:

```
appendonly.aof
```

---

## 🔥 What Happens on Restart?

Redis replays all commands from AOF file to rebuild memory.

Like:

```
Re-run every command
→ Reconstruct state
```

---

## ⚙️ AOF Sync Modes

Very important.

You can configure:

### 1️⃣ everysec (default)

* Sync to disk every 1 second
* Max 1 second data loss
* Balanced performance

### 2️⃣ always

* Write to disk every command
* No data loss
* Slower

### 3️⃣ no

* Let OS decide
* Faster
* Riskier

---

## 🟢 Pros of AOF

* Much less data loss
* More durable
* Safer for production

## 🔴 Cons

* Larger file size
* Slower restart (must replay commands)
* More disk I/O

---

# 🟣 RDB vs AOF Comparison

| Feature              | RDB      | AOF          |
| -------------------- | -------- | ------------ |
| How it saves         | Snapshot | Log commands |
| Data loss risk       | Higher   | Lower        |
| File size            | Small    | Bigger       |
| Restart speed        | Fast     | Slower       |
| Performance overhead | Low      | Higher       |
| Backup friendly      | Yes      | Less         |

---

# 🧠 What Do Big Companies Use?

Most production systems use:

```
AOF + RDB together
```

Why?

* RDB → Fast recovery
* AOF → Minimal data loss

If both enabled:

Redis loads AOF first (more recent).

---

# 🚀 In Your EC2 Example

You said:

> If Redis EC2 crashes and comes back?

If:

* No persistence → everything lost.
* RDB → restored to last snapshot.
* AOF everysec → at most 1 second lost.
* AOF always → almost nothing lost.

So production setups rarely run Redis without persistence.

---

# 🔥 Important: This Is Not HA (High Availability)

RDB/AOF only protect from restart.

If EC2 machine dies permanently?

You need:

* Replication (Primary + Replica)
* Redis Cluster
* AWS ElastiCache with automatic failover

Persistence ≠ High Availability.

---

# 🎯 Real-World Decision Guide

Use RDB if:

* Cache only
* Occasional data loss acceptable
* Need fast restart

Use AOF if:

* Session storage
* Job queue
* Financial counters
* Ride matching state (Uber-like)

Use both if:

* Production serious system

---

# 🧠 Final Clear Mental Model

RDB =

> “Take photo sometimes”

AOF =

> “Record everything that happens”
