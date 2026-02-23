# 🔹 1️⃣ Creating the Counter

```ts
const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});
```

## ✅ What is happening here?

You are creating a **Counter metric** using `prom-client`.

### 🔸 `name`

```ts
name: 'http_requests_total'
```

* This is the metric name stored inside Prometheus.
* By convention, counters end with `_total`.
* It must be unique.

In Prometheus, it will appear like:

```
http_requests_total{method="GET",route="/users",status_code="200"} 15
```

---

### 🔸 `help`

```ts
help: 'Total number of HTTP requests'
```

* Human-readable description.
* Used when someone views `/metrics`.
* Required field.

It shows up like:

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
```

---

### 🔸 `labelNames`

```ts
labelNames: ['method', 'route', 'status_code']
```

This is VERY important.

Labels allow you to break the metric into dimensions.

Instead of just:

```
http_requests_total 100
```

You get:

```
http_requests_total{method="GET",route="/login",status_code="200"} 20
http_requests_total{method="POST",route="/login",status_code="401"} 5
```

Now you can filter:

* Only POST requests
* Only 500 errors
* Only a specific route

This makes your monitoring powerful.

---

# 🔹 2️⃣ Middleware Definition

```ts
const requestCountMiddleware = (req, res, next) => {
```

You are creating an Express middleware.

This means:

* It runs for every request.
* It wraps the request lifecycle.

Good design choice.

---

# 🔹 3️⃣ Measuring Start Time

```ts
const startTime = Date.now();
```

This captures the timestamp when the request starts.

You are calculating request duration manually here.

Note:
You are not storing it in Prometheus yet.
You are just logging it.

---

# 🔹 4️⃣ Listening to Response Finish

```ts
res.on('finish', () => {
```

This is extremely important.

Why?

Because:

* `finish` fires when response is fully sent.
* At this point:

  * Status code is final
  * Headers are sent
  * Request completed

If you increment before this, you might:

* Miss errors
* Record wrong status codes

This is production-safe placement.

---

# 🔹 5️⃣ Calculating Duration

```ts
const endTime = Date.now();
console.log(`Request took ${endTime - startTime}ms`);
```

You’re measuring:

```
Response time = endTime - startTime
```

Right now:

* You’re only logging it.
* You are NOT sending this to Prometheus.

If you wanted proper latency monitoring, you'd use a **Histogram**, not a Counter.

---

# 🔹 6️⃣ Incrementing the Counter

```ts
requestCounter.inc({
    method: req.method,
    route: req.route ? req.route.path : req.path,
    status_code: res.statusCode
});
```

This is the core line.

Let’s break it down.

---

## 🔸 `.inc()`

`.inc()` increases the counter by 1.

Equivalent to:

```
http_requests_total += 1
```

---

## 🔸 Labels Being Attached

You are passing labels:

```ts
{
  method: req.method,
  route: req.route ? req.route.path : req.path,
  status_code: res.statusCode
}
```

### method

Examples:

* GET
* POST
* PUT

---

### route

This part is smart:

```ts
req.route ? req.route.path : req.path
```

Why?

Because sometimes:

* `req.route` exists (matched route)
* Sometimes it doesn't (404 or middleware)

This prevents crashing.

It ensures:
You always attach some route label.

---

### status_code

Captures:

* 200
* 404
* 500
* 401

Now you can calculate:

Error rate:

```
rate(http_requests_total{status_code="500"}[1m])
```

That’s powerful production monitoring.

---

# 🔹 7️⃣ Calling next()

```ts
next();
```

This passes control to the next middleware or route.

If you forget this:
Request will hang.

---

# 🔹 8️⃣ Registering Middleware

```ts
app.use(requestCountMiddleware);
```

This ensures:
Every route is tracked.

Important:
If you add this AFTER routes,
some routes won’t be counted.

It should be added early in setup.

---

# 🔹 9️⃣ Exposing /metrics Endpoint

```ts
app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
});
```

This does 3 important things:

---

### 1️⃣ `client.register.metrics()`

This gathers:

* All registered metrics
* In Prometheus format

---

### 2️⃣ Setting Content-Type

```ts
res.set('Content-Type', client.register.contentType);
```

Prometheus expects a specific format:

```
text/plain; version=0.0.4
```

Without correct content type, scraping fails.

---

### 3️⃣ Sending Metrics

```ts
res.end(metrics);
```

Now when Prometheus scrapes:

```
http://your-app:3000/metrics
```

It gets:

```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/",status_code="200"} 12
```

---

# 🔹 Important Observations

### ✅ This is correct usage of Counter.

### ❗ But:

You are measuring duration manually.

For proper latency tracking, you should use:

* Histogram for duration
* Counter for request count

Because:
Counter = event count
Histogram = duration distribution

---

# 🔹 What This Code Achieves

You can now:

* Monitor total traffic
* Monitor error rate
* Monitor route-level traffic
* Monitor method usage
* Detect spikes

And use queries like:

Requests per second:

```
rate(http_requests_total[1m])
```

Error rate:

```
rate(http_requests_total{status_code="500"}[1m])
```

---

# 🔹 Production-Level Insight

This is already good.

But in large systems, people also:

* Use `collectDefaultMetrics()` for CPU/memory
* Add Histogram for request duration
* Add Gauge for active connections

---

# 🔥 Final Summary

Your code does:

1. Creates a counter metric
2. Wraps all HTTP requests
3. Waits until response finishes
4. Increments counter with labels
5. Exposes metrics endpoint
6. Allows Prometheus to scrape it

It is clean, correct, and interview-ready.