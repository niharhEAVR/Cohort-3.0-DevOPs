**How to add a Counter in a Node.js backend** using Prometheus properly.

We’ll assume:

* You have an Express backend
* You want to count total HTTP requests

---

# 1️⃣ Install Prometheus Client Library

In Node.js, we use:

```
prom-client
```

Install it:

```bash
npm install prom-client
```

This is the official Prometheus client for Node.

---

# 2️⃣ Basic Idea

We need to:

1. Create a Counter
2. Increment it when events happen
3. Expose `/metrics`
4. Let Prometheus scrape it

That’s the full flow.

---

# 3️⃣ Create a Counter

Inside your backend (for example `metrics.js` or inside main server file):

```js
const client = require('prom-client');

// Create a counter
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});
```

### Important fields:

* `name` → must be unique
* `help` → description
* `labelNames` → dimensions (VERY important)

---

# 4️⃣ Increment the Counter

Now we increment it whenever a request finishes.

In Express, use middleware:

```js
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode
    });
  });

  next();
});
```

Now every request increases:

```
http_requests_total{method="GET",route="/users",status="200"}
```

This is production-style usage.

---

# 5️⃣ Expose `/metrics` Endpoint

Prometheus needs a metrics endpoint.

Add this:

```js
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
```

Now if you visit:

```
http://localhost:3000/metrics
```

You’ll see something like:

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/users",status="200"} 15
```

That means it’s working.

---

# 6️⃣ Configure Prometheus to Scrape It

Inside `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'node-app'
    static_configs:
      - targets: ['localhost:3000']
```

Then start Prometheus.

Now Prometheus will scrape:

```
http://localhost:3000/metrics
```

Every 15 seconds (default).

---

# 7️⃣ How You Query It

Inside Prometheus UI (port 9090):

Total requests:

```
http_requests_total
```

Requests per second:

```
rate(http_requests_total[1m])
```

Error rate example:

```
rate(http_requests_total{status="500"}[1m])
```

---

# 8️⃣ Why This Is the Correct Way

We increment in `res.on('finish')` because:

* It ensures response completed
* We get final status code
* It avoids counting failed middleware attempts

This is production-safe.

---

# 9️⃣ What NOT To Do

❌ Don’t increment manually in every route
❌ Don’t forget labels
❌ Don’t use random metric names
❌ Don’t expose `/metrics` publicly without security

---

# 🔟 For Your WebSocket App

Since you also build WebSocket servers, you could add:

```js
const wsMessagesTotal = new client.Counter({
  name: 'websocket_messages_total',
  help: 'Total WebSocket messages processed'
});
```

Then increment inside message handler.

That would make your real-time app production-monitored.

---

# Final Mental Model

Counter = event counter
You increment when something happens.

Prometheus scrapes the value.
PromQL calculates rate over time.

That’s the complete lifecycle.
