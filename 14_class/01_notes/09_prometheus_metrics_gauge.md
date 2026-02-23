# 1️⃣ What Is a Gauge?

A **Gauge** is a metric that:

* ✅ Can increase
* ✅ Can decrease
* ✅ Can be set to a specific value

Unlike Counter (which only increases), Gauge represents a **current state**.

Think of it as:

> “What is the value right now?”

---

# 2️⃣ When Do We Use Gauge?

Use Gauge for things like:

* Current active users
* Current WebSocket connections
* Current memory usage
* Current queue size
* Current CPU usage

If the value can go up and down → use Gauge.

---

# 3️⃣ Creating a Gauge in Node.js

Using `prom-client`.

---

## 🔹 Step 1: Create the Gauge

```ts
const activeRequestsGauge = new client.Gauge({
  name: 'active_http_requests',
  help: 'Number of currently active HTTP requests'
});
```

This creates a metric like:

```text
# HELP active_http_requests Number of currently active HTTP requests
# TYPE active_http_requests gauge
active_http_requests 3
```

---

# 4️⃣ Tracking Active HTTP Requests (Best Beginner Example)

We will:

* Increase when request starts
* Decrease when request finishes

---

## 🔹 Step 2: Add Middleware

```ts
const activeRequestMiddleware = (req, res, next) => {
  activeRequestsGauge.inc(); // request started

  res.on('finish', () => {
    activeRequestsGauge.dec(); // request finished
  });

  next();
};

app.use(activeRequestMiddleware);
```

---

## 🔍 What’s Happening?

When a request comes in:

```text
active_http_requests = 1
```

If another request starts before the first ends:

```text
active_http_requests = 2
```

When one finishes:

```text
active_http_requests = 1
```

This gives you real-time concurrency visibility.

---

# 5️⃣ Another Way: Using set()

Gauge can also directly set values.

Example:

```ts
memoryGauge.set(process.memoryUsage().heapUsed);
```

That overwrites the current value.

Gauge supports:

* `.inc()`
* `.dec()`
* `.set(value)`

---

# 6️⃣ Adding Labels to Gauge

You can add labels too:

```ts
const activeConnectionsGauge = new client.Gauge({
  name: 'active_websocket_connections',
  help: 'Current active WebSocket connections',
  labelNames: ['room']
});
```

Then:

```ts
activeConnectionsGauge.inc({ room: 'room1' });
activeConnectionsGauge.dec({ room: 'room1' });
```

⚠️ Be careful:
Do NOT use user IDs as labels (cardinality problem).

---

# 7️⃣ Real Example for Your WebSocket App

Since you build WebSocket systems:

```ts
const wsConnections = new client.Gauge({
  name: 'active_websocket_connections',
  help: 'Current number of active WebSocket connections'
});
```

On connection:

```ts
wsConnections.inc();
```

On disconnect:

```ts
wsConnections.dec();
```

Now in Prometheus you can see:

```promql
active_websocket_connections
```

And track spikes.

---

# 8️⃣ What Happens If Server Restarts?

Gauge resets to 0.

But that’s correct.

Because Gauge represents current state.

After restart:

Active connections = 0.

That is true.

So no issue like Counter reset confusion.

---

# 9️⃣ When NOT To Use Gauge

Don’t use Gauge for:

* Total number of requests ever
* Total errors ever
* Event counts

That’s Counter’s job.

---

# 🔟 Production Insight

Common pattern in real systems:

* Counter → total events
* Gauge → current state
* Histogram → latency

If you combine all three, your monitoring becomes powerful.

---

# 1️⃣1️⃣ What Should You Add Next?

Since you already log duration manually:

```ts
const startTime = Date.now();
```

The next correct step is:

👉 Replace that manual logging with a Histogram
That will allow p95, p99 latency tracking.

That’s where real monitoring becomes serious.
