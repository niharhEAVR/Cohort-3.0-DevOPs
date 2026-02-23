# 🔹 1️⃣ What Is a Histogram?

A **Histogram** in Prometheus:

* Records observed values (like request duration)
* Groups them into buckets (ranges)
* Tracks:

  * How many values fall into each bucket
  * Total number of observations
  * Total sum of all observations

It helps answer:

* How many requests were under 100ms?
* What is p95 latency?
* Are requests getting slower?

Unlike Counter (count events)
Unlike Gauge (current state)

Histogram = distribution of values over time.

---

# 🔹 2️⃣ Histogram Definition


```ts
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000]
});
```

Let’s break it down.

---

## ✅ `name`

```ts
name: 'http_request_duration_ms'
```

This is the metric name stored in Prometheus.

⚠️ Important best practice:

Prometheus convention is to use **base unit**.

Instead of `_ms`, most production systems use:

```ts
http_request_duration_seconds
```

Why?

Because Prometheus standardizes around **seconds**.

---

## ✅ `buckets`

```ts
buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000]
```

storing milliseconds, these mean:

* ≤ 0.1 ms
* ≤ 5 ms
* ≤ 15 ms
* ≤ 50 ms
* ≤ 100 ms
* ≤ 300 ms
* ≤ 500 ms
* ≤ 1000 ms (1 sec)
* ≤ 3000 ms (3 sec)
* ≤ 5000 ms (5 sec)

Each request gets placed into these ranges.

---

# 🔹 3️⃣ Now Let’s Break Middleware

```ts
const startTime = process.hrtime();
```

This captures high-resolution start time.


---

### When response finishes:

```ts
const [seconds, nanoseconds] = process.hrtime(startTime);
const durationInSeconds = seconds + nanoseconds / 1e9;
```

This calculates exact request duration in seconds.

---

Then:

```ts
durationInSeconds * 1000
```

Convert it into milliseconds.

That matches the bucket definition.

---

# 🔹 4️⃣ This Line Is The Core of Histogram

```ts
httpRequestDurationMicroseconds.observe(
  {
    method: req.method,
    route: req.route ? req.route.path : req.path,
    status_code: res.statusCode
  },
  durationInSeconds * 1000
);
```

What `.observe()` does:

1. Takes the value (duration)
2. Places it into correct bucket
3. Increases:

   * bucket count
   * total count
   * total sum

Example:

If request took 120ms:

It increments buckets:

```
≤300
≤500
≤1000
≤3000
≤5000
```

And also:

```
http_request_duration_ms_count++
http_request_duration_ms_sum += 120
```

That’s how percentiles are later calculated.

---

# 🔹 5️⃣ What Will Appear in `/metrics`?

You’ll see something like:

```
http_request_duration_ms_bucket{le="100"} 12
http_request_duration_ms_bucket{le="300"} 25
http_request_duration_ms_bucket{le="500"} 40
http_request_duration_ms_bucket{le="+Inf"} 50

http_request_duration_ms_sum 8423
http_request_duration_ms_count 50
```

Prometheus uses `_bucket`, `_sum`, `_count` internally.

---

# 🔹 6️⃣ Important Improvement (Very Important)

Since Prometheus standard unit is seconds, better practice:

Change metric to:

```ts
name: 'http_request_duration_seconds'
```

And don’t multiply by 1000.

Then use buckets like:

```ts
buckets: [0.05, 0.1, 0.2, 0.3, 0.5, 1, 2, 5]
```

That is production convention.

It avoids confusion.

---

# 🔹 7️⃣ Final Understanding

From your code:

* `process.hrtime()` → accurate timing
* `.observe()` → pushes duration into histogram
* Buckets → define latency ranges
* Prometheus → calculates percentiles from buckets

Only suggestion:
Use seconds instead of ms for industry-standard format.
