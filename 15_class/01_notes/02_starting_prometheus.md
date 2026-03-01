# 🧠 What You Did Previously

In the last class, you:

* Installed `prom-client`
* Created `/metrics` endpoint
* Exposed metrics from your Node app

Something like:

```ts
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
```

That means:

👉 Your app is **ready to expose metrics**

But right now, nobody is collecting them.

---

# 🚀 Now What We’re Doing

Now we will:

> Run Prometheus
> Tell it where your Node app is
> Make it scrape `/metrics` every 15 seconds

---

# 📊 What is Prometheus Doing?

Prometheus works like this:

```
Every 15 seconds:
   ↓
Calls: http://your-node-app:3000/metrics
   ↓
Stores the data
   ↓
You can query it later
```

Your Node app does NOT push data.

Prometheus PULLS data.

---

# 🛠 Step 1 — Create `prometheus.yml`

Create a file:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "node-app"
    static_configs:
      - targets: ["localhost:3000"]
```

### 🔎 What This Means

| Field                | Meaning                 |
| -------------------- | ----------------------- |
| scrape_interval: 15s | Scrape every 15 seconds |
| job_name             | Just a label            |
| targets              | Where `/metrics` exists |

If your Node app runs on port 3000 locally, this is correct.

---

# 🐳 Step 2 — Run Prometheus (Docker Way - Recommended)

```bash
docker run -p 9090:9090 \
  -v ./prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

# but wait!!!!!!!!!!!!!!!!!!

# 🔎 The Command

```bash
docker run -p 9090:9090 \
  -v ./prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

This command is doing **5 important things**.

---

# 🧱 1️⃣ `docker run`

This means:

> Create and start a new container from an image.

If the image doesn’t exist locally, Docker will:

* Pull it from Docker Hub
* Then run it

In this case:

```bash
prom/prometheus
```

is the official Prometheus image.

---

# 🌐 2️⃣ `-p 9090:9090`

This is **port mapping**.

Format:

```bash
-p HOST_PORT:CONTAINER_PORT
```

So here:

```bash
-p 9090:9090
```

Means:

* Expose container’s port 9090
* Make it available on your machine’s port 9090

Without this, you couldn’t open:

```
http://localhost:9090
```

Because containers are isolated.

---

# 📂 3️⃣ `-v ./prometheus.yml:/etc/prometheus/prometheus.yml`

This is a **volume mount**.

Format:

```bash
-v host_path:container_path
```

Here:

| Host Machine     | Container                      |
| ---------------- | ------------------------------ |
| ./prometheus.yml | /etc/prometheus/prometheus.yml |

So what happens?

Docker takes your local file and mounts it **inside the container**.

That means:

When Prometheus starts,
It reads configuration from:

```
/etc/prometheus/prometheus.yml
```

And that file is actually your local file.

So if you edit it locally → Prometheus sees changes (after restart).

---

# 🖼 4️⃣ `prom/prometheus`

This is the Docker image.

Inside this image:

* Prometheus binary
* Default configuration
* Web UI
* Everything pre-installed

When container starts, it runs:

```
prometheus --config.file=/etc/prometheus/prometheus.yml
```

Automatically.

---

# 🧠 5️⃣ What Happens Internally

When you run the command:

1. Docker creates a new container
2. It isolates it (own network, filesystem)
3. Mounts your config file
4. Maps port 9090
5. Starts Prometheus server
6. Prometheus begins scraping targets every 15s

---

# 🚨 Now The Important Part

## Why This Breaks In Your Case

Your Node app is running:

```
On your machine
localhost:3000
```

Prometheus is running:

```
Inside container
```

Inside container:

```
localhost = container itself
```

So when Prometheus tries:

```
http://localhost:3000/metrics
```

It is looking inside the container.

But your Node app is outside.

That’s the network problem.

---

# 🧠 Why Containers Cannot See Host Directly

Containers are isolated.

They have:

* Their own network namespace
* Their own localhost
* Their own filesystem

So:

```
Host Machine ≠ Container
```

Unless you explicitly connect them.

---

# 🔥 Why We Need docker-compose

Now here’s the real reason.

Instead of:

* Running Prometheus separately
* Running Node separately
* Managing networking manually
* Using host.docker.internal hacks

We create a shared Docker network.

docker-compose automatically:

* Creates network
* Connects services
* Creates internal DNS
* Starts services in correct order

So instead of:

```
localhost:3000
```

We use:

```
node-app:3000
```

Because Docker gives automatic DNS resolution.

---

# 🏗 Why Dockerfile Is Needed

Dockerfile is needed to:

* Containerize your Bun app
* Make it portable
* Make it consistent
* Run it inside same Docker network

Without Dockerfile:

Your Node app lives outside Docker.

With Dockerfile:

Your Node app becomes a container.

Then:

```
node-app container
prometheus container
grafana container
```

All inside same network.

No hacks.
No localhost confusion.
Production-style setup.

---

# 🧩 Final Architecture Comparison

### ❌ Old Setup

```
Host
 ├── Node app
 └── Docker → Prometheus
```

Networking messy.

---

### ✅ Proper Setup

```
Docker Network
 ├── node-app container
 ├── prometheus container
 └── grafana container
```

Clean.
Scalable.
Professional.

---

# 🧠 Simple Mental Model

Docker run = manual container start
Dockerfile = recipe to build container
Docker-compose = orchestrator for multiple containers
