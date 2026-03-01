# 🧾 Top Line

```yaml
version: '3.8'
```

This tells Docker:

> Use Compose file format version 3.8

It defines which features are supported.

---

# 🧱 `services:`

Everything inside `services:` becomes a container.

You defined 3 services:

1. node-app
2. prometheus
3. grafana

Each becomes its own container.

---

# 🟢 1️⃣ node-app Service

```yaml
node-app:
  build: .
  container_name: node-app
  ports:
    - "3000:3000"
  networks:
    - monitoring
```

### 🔹 `build: .`

This tells Docker:

> Build an image using the Dockerfile in the current folder.

So it runs your Bun Dockerfile.

---

### 🔹 `container_name: node-app`

Instead of random name like:

```
project_node-app_1
```

It forces container name to:

```
node-app
```

Important because:

Prometheus will use this name as hostname.

---

### 🔹 `ports:`

```
3000:3000
```

Format:

```
HOST_PORT:CONTAINER_PORT
```

So:

* Your machine → port 3000
* Container → port 3000

This allows you to access:

```
http://localhost:3000
```

---

### 🔹 `networks: monitoring`

This connects the container to the custom network named `monitoring`.

This is what allows:

```
prometheus → node-app
```

communication.

---

# 🔵 2️⃣ Prometheus Service

```yaml
prometheus:
  image: prom/prometheus:latest
  container_name: prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"
  depends_on:
    - node-app
  networks:
    - monitoring
```

---

### 🔹 `image: prom/prometheus:latest`

Instead of building, it pulls the official Prometheus image.

---

### 🔹 `volumes`

```
./prometheus.yml:/etc/prometheus/prometheus.yml
```

This mounts your local config file into the container.

So Prometheus reads your configuration.

---

### 🔹 `ports`

```
9090:9090
```

You can access Prometheus UI at:

```
http://localhost:9090
```

---

### 🔹 `depends_on`

```
depends_on:
  - node-app
```

This means:

Start node-app first,
then start Prometheus.

⚠ Important:
This does NOT wait until node-app is fully ready.
It just controls startup order.

---

### 🔹 `networks: monitoring`

Now Prometheus and node-app are in the same network.

So inside Docker:

```
http://node-app:3000/metrics
```

works.

---

# 🟠 3️⃣ Grafana Service

```yaml
grafana:
  image: grafana/grafana:latest
  container_name: grafana
  ports:
    - "3001:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
  depends_on:
    - prometheus
  networks:
    - monitoring
```

---

### 🔹 `image`

Pulls official Grafana image.

---

### 🔹 `ports`

```
3001:3000
```

Container runs on 3000 internally,
but we map it to 3001 on host.

So open:

```
http://localhost:3001
```

---

### 🔹 `environment`

Sets default admin password to:

```
admin
```

So login:

* username: admin
* password: admin

---

### 🔹 `depends_on`

Start Prometheus before Grafana.

---

# 🌐 networks Section

```yaml
networks:
  monitoring:
```

This creates a custom bridge network called:

```
monitoring
```

All services connected to it can:

* Talk using container names
* Resolve DNS automatically
* Communicate privately

---

# 🧠 What Happens When You Run

```bash
docker-compose up --build
```

Docker does this:

1. Builds Bun app image
2. Creates monitoring network
3. Starts node-app container
4. Starts prometheus container
5. Starts grafana container
6. Connects all to same network

---

# 🏗 Final Architecture

Inside Docker:

```
monitoring network
 ├── node-app (3000)
 ├── prometheus (9090)
 └── grafana (3000 internal)
```

Outside (your laptop):

```
localhost:3000 → node-app
localhost:9090 → prometheus
localhost:3001 → grafana
```

---

# 🧩 Why This Is Proper Architecture

* Clean separation of services
* Internal communication via network
* No localhost confusion
* Production-style structure
* Scalable

This is how microservices talk in Docker.
