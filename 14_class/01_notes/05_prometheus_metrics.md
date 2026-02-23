# 1️⃣ Adding Prometheus to Your Application

Prometheus itself does not magically know your app metrics.

Your application must:

1. Use a Prometheus client library
2. Expose a `/metrics` endpoint
3. Let Prometheus scrape it

For Node.js, people use:

* `prom-client` (official Node Prometheus client)

Flow becomes:

```
Your App → exposes /metrics → Prometheus scrapes → stores in TSDB
```

That’s it.

Now let’s understand the types of metrics you mentioned.

---

# 2️⃣ Types of Metrics in Prometheus

Prometheus has **four main metric types**, but we’ll focus on the three you mentioned:

* Counter
* Gauge
* Histogram

Each type solves a different monitoring problem.

Understanding when to use which one is very important.

---

# 3️⃣ Counter

## 🔹 Definition

A **Counter** is a cumulative metric that only increases.

It can:

* Increase
* Reset to zero (only when app restarts)

It cannot:

* Decrease manually

---

## 🔹 When to Use It

Use a Counter when you are counting events.

Examples:

* Total HTTP requests
* Total errors
* Total logins
* Total WebSocket messages sent

---

## 🔹 Real Example

Let’s say your backend receives requests.

Every time a request comes:

```
http_requests_total += 1
```

If your app runs for 1 hour:

```
http_requests_total = 10,000
```

If app restarts:
It resets to 0.

Prometheus handles this using rate functions like:

```
rate(http_requests_total[1m])
```

This calculates requests per second.

---

## 🔹 Why Counter Is Powerful

You don’t care about total count.
You care about rate over time.

That’s why Prometheus is time-series focused.

---

# 4️⃣ Gauge

## 🔹 Definition

A **Gauge** can increase and decrease.

It represents a value at a specific moment.

---

## 🔹 When to Use It

Use Gauge for fluctuating values.

Examples:

* Current memory usage
* Current CPU usage
* Active WebSocket connections
* Current queue size
* Active users online

---

## 🔹 Real Example

Imagine you track active users:

User connects:

```
active_users += 1
```

User disconnects:

```
active_users -= 1
```

This number constantly moves up and down.

That’s why Gauge exists.

---

## 🔹 Key Difference From Counter

Counter = Only increases
Gauge = Can go up and down

Simple rule:

If the number can decrease → use Gauge.

---

# 5️⃣ Histogram

Now we go deeper.

Histogram is more advanced and very powerful.

---

## 🔹 Definition

A **Histogram** measures distributions.

It groups observed values into buckets.

It also records:

* Total sum of values
* Total count of values

---

## 🔹 When to Use It

Use Histogram for:

* Request duration
* API response time
* Database query time
* Response size
* Processing time

Anything where you measure duration or size.

---

## 🔹 Example: HTTP Request Duration

Let’s say your request durations are:

```
120ms
250ms
400ms
50ms
```

Histogram creates buckets like:

```
<100ms
<200ms
<300ms
<500ms
```

And counts how many fall in each bucket.

It also stores:

* Total count
* Total sum

---

## 🔹 Why Histogram Is Powerful

Because now you can calculate:

* Average latency
* p95 latency
* p99 latency

Example query:

```
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

That gives p95 latency.

This is extremely important in production systems.

---

# 6️⃣ Real-World Example for Your Stack

Let’s connect this to your backend.

You should track:

### Counter

* http_requests_total
* http_errors_total
* websocket_messages_total

### Gauge

* active_websocket_connections
* memory_usage_bytes
* queue_size

### Histogram

* http_request_duration_seconds
* database_query_duration_seconds

That gives you:

* Traffic rate
* System load
* Latency distribution
* Error spikes

Production-level monitoring.

---

# 7️⃣ Important Concept: Why Not Just Use Gauge for Everything?

Because:

Counters are better for event tracking.
Histograms are better for distributions.
Gauges are better for current state.

If you misuse them:

* Queries become incorrect
* Rates break
* Percentiles cannot be calculated

Each metric type has a purpose.

---

# 8️⃣ Quick Comparison Table

| Type      | Can Decrease?            | Used For                |
| --------- | ------------------------ | ----------------------- |
| Counter   | ❌ No                     | Event counts            |
| Gauge     | ✅ Yes                    | Current state           |
| Histogram | ❌ (records observations) | Latency & distributions |

---

# 9️⃣ Small But Important Insight

In interviews, if someone asks:

“How would you monitor a Node backend?”

A strong answer:

* Counter for total requests and errors
* Gauge for active connections
* Histogram for latency
* Alerts on error rate and p95 latency

That shows real understanding.

---

# 🔟 Final Understanding

Prometheus metric types are not random.

They represent:

* Event frequency (Counter)
* Current state (Gauge)
* Performance distribution (Histogram)

If you use them correctly, you can:

* Detect slow APIs
* Detect traffic spikes
* Detect memory leaks
* Detect system overload

That’s real monitoring.
