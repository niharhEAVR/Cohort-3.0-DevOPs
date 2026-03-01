## 🔎 What are Queries in Prometheus?

In **Prometheus**, a **query** is a way to ask questions about your metrics data.

Think of it like:

> 🧠 Database → You write SQL queries
> 📊 Prometheus → You write **PromQL queries**

Prometheus uses its own query language called:

👉 **PromQL (Prometheus Query Language)**

---

## 🧩 Why Do We Need Queries?

Prometheus continuously collects metrics like:

* HTTP request count
* Response time
* CPU usage
* Memory usage
* Error rate

But raw numbers are useless unless you can **analyze** them.

Queries help you answer questions like:

* How many requests per second is my backend handling?
* What is the average response time?
* What is the p95 latency?
* How many 500 errors happened in last 5 minutes?

---

## 🧪 Simple Example (From Your Backend)

You probably have something like:

```
http_request_duration_ms_bucket
http_requests_total
```

### 1️⃣ Basic Query

```
http_requests_total
```

👉 Shows total number of HTTP requests.

---

### 2️⃣ Filter by Label

Prometheus metrics have labels like:

```
method="GET"
route="/metrics"
status_code="200"
```

Query:

```
http_requests_total{method="GET"}
```

👉 Only GET requests.

---

### 3️⃣ Requests Per Second

```
rate(http_requests_total[1m])
```

👉 Calculates per-second request rate over last 1 minute.

This is VERY important for backend monitoring.

---

### 4️⃣ p95 Latency (Very Important)

If you're using histogram:

```
histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m]))
```

👉 Gives 95th percentile latency over last 5 minutes.

That means:

> 95% of requests are faster than this value.

---

## 📊 Where Do You Use Queries?

You use queries in:

* Prometheus UI
* Grafana dashboards
* Alert rules

Example alert:

```
rate(http_requests_total{status_code="500"}[5m]) > 5
```

👉 If more than 5 errors per second → trigger alert.

---

## 🧠 Simple Analogy

Think of Prometheus like:

* 📦 Warehouse storing metrics
* 🔎 PromQL is your search tool
* 📊 Grafana is your visualization tool

Without queries, metrics are just stored numbers.

---

## ⚡ Types of PromQL Queries

### 1️⃣ Instant Query

Gets current value.

Example:

```
up
```

Shows which targets are up right now.

---

### 2️⃣ Range Query

Gets values over time.

Used for graphs.

Example:

```
rate(http_requests_total[5m])
```

---

## 🛠 Since You're Learning DevOps

Because you're running:

* Docker
* Prometheus
* Backend app
* Planning production EC2

You’ll mainly use queries to monitor:

* RPS (requests per second)
* Error rate
* Latency (p95, p99)
* CPU / Memory usage
* Container health

This is real production-level knowledge you're building. 🔥

---
---
---
---
---
---
---
---
---
---



# 🧠 PromQL Has MANY More Things

PromQL isn’t just:

* `rate()`
* `histogram_quantile()`
* filtering by labels

There are **multiple categories** of queries.

---

# 🔹 1. Basic Metric Queries (Foundation)

These are simplest:

```
http_requests_total
```

Filter:

```
http_requests_total{method="POST", status="500"}
```

Aggregate:

```
sum(http_requests_total)
```

---

# 🔹 2. Aggregation Operators

These are VERY powerful.

* `sum()`
* `avg()`
* `max()`
* `min()`
* `count()`
* `stddev()`
* `topk()`
* `bottomk()`

### Example

Show top 5 routes by traffic:

```
topk(5, sum(rate(http_requests_total[5m])) by (route))
```

That’s production-level dashboard stuff.

---

# 🔹 3. Rate & Counter Functions

For counters (like request count):

* `rate()` → smooth rate
* `irate()` → instant rate (more spiky)
* `increase()` → total increase in time range

Example:

```
increase(http_requests_total[10m])
```

Shows total requests in last 10 minutes.

---

# 🔹 4. Time Functions

* `time()`
* `day_of_week()`
* `hour()`
* `month()`

Yes, you can do time-based queries too.

---

# 🔹 5. Mathematical Operations

You can literally do math.

```
rate(errors_total[5m]) 
/
rate(requests_total[5m])
```

👉 That’s error rate %

You can also:

```
+  -  *  /  %  ^ 
```

---

# 🔹 6. Logical / Comparison Operators

```
> < >= <= == !=
```

Used in alerts:

```
rate(http_requests_total{status="500"}[5m]) > 0.05
```

---

# 🔹 7. Histogram-Specific Functions

* `histogram_quantile()`
* `sum by (le)`

Used for:

* p95
* p99
* latency percentiles

---

# 🔹 8. Vector Matching (Advanced Level)

This is where PromQL becomes dangerous 😈

You can join metrics together using:

* `on()`
* `ignoring()`
* `group_left`
* `group_right`

This is used in complex Kubernetes monitoring.

---

# 🔹 9. Recording Rules (Performance Optimization)

Instead of writing long query again and again, you precompute:

```
record: job:http_requests:rate5m
expr: rate(http_requests_total[5m])
```

Now you just use:

```
job:http_requests:rate5m
```

---

# 🔥 So How Big Is PromQL Actually?

Very big.

It is almost like:

👉 SQL + Time-series math + Analytics language

And production DevOps engineers spend YEARS mastering it.

---

# 💡 But Here’s The Important Part (For You)

Since you're:

* Running backend
* Learning Prometheus
* Planning EC2 production

You realistically need to master:

1. `rate()`
2. `increase()`
3. `sum by()`
4. `histogram_quantile()`
5. Error rate calculation
6. Alert conditions

That alone makes you better than 70% of beginner DevOps learners.
