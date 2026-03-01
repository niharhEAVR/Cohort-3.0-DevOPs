# 🚨 Why Protect `/metrics`?

Your metrics endpoint exposes:

* CPU usage
* Memory usage
* Request counts
* Internal routes
* Possibly sensitive labels

If public:

```text
Anyone can scan your infra
Attackers get system info
Bots can overload it
```

So we protect it.

---

# 🛡 4 Common Ways to Protect `/metrics`

I’ll show from simple → production-grade.

---

# ✅ 1️⃣ Protect Using Basic Auth (Simple & Good)

In your Bun/Express app:

```ts
app.get("/metrics", async (req, res) => {
  const auth = req.headers.authorization;

  if (!auth || auth !== "Basic " + Buffer.from("admin:secret").toString("base64")) {
    return res.status(401).send("Unauthorized");
  }

  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
```

Then in `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: "node-app"
    basic_auth:
      username: admin
      password: secret
    static_configs:
      - targets: ["node-app:3000"]
```

Now Prometheus must authenticate.

---

# ✅ 2️⃣ Protect By IP (Better Inside Docker)

Only allow Prometheus container.

Example:

```ts
app.get("/metrics", async (req, res) => {
  const allowedIP = "172.18.0.3"; // Prometheus container IP

  if (req.ip !== allowedIP) {
    return res.status(403).send("Forbidden");
  }

  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
```

But IP changes sometimes, so this is not ideal alone.

---

# ✅ 3️⃣ Best Practice in Docker → Don’t Expose Port Publicly

Instead of:

```yaml
ports:
  - "3000:3000"
```

Use:

```yaml
expose:
  - "3000"
```

Difference:

| ports         | expose        |
| ------------- | ------------- |
| Public access | Internal only |

Now:

* Node app is accessible inside Docker network
* Not accessible from outside

Prometheus can scrape it
Internet cannot.

🔥 This is the cleanest Docker approach.

---

# ✅ 4️⃣ Best Production Method → Protect via Reverse Proxy (Nginx)

You can:

* Allow only Prometheus IP
* Or add auth at Nginx level
* Or block `/metrics` from public internet

Example in Nginx:

```nginx
location /metrics {
    allow 172.18.0.0/16;
    deny all;
}
```

Now only internal network can access it.

This is very common in real production.

---

# 🎯 What I Recommend For Your Setup

Since you're using:

* Docker
* Prometheus
* Grafana

Best approach:

1. Remove `ports: 3000:3000`
2. Use `expose: 3000`
3. Keep everything inside same Docker network
4. Let Prometheus scrape via service name

That’s clean and secure.

---

# 🧠 Final Rule

Never expose `/metrics` publicly unless:

* It’s protected
* Or behind VPN
* Or internal network only

Monitoring endpoints are powerful and sensitive.
