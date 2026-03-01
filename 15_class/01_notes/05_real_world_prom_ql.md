# 🔥 1️⃣ Real World Question:

## “Is my server under stress right now?”

### 🧠 Business Meaning:

If CPU is too high → app may slow down → users suffer.

### ✅ PromQL:

```promql
cpu_usage_percent
```

But that’s raw.

Better:

```promql
avg(cpu_usage_percent)
```

Or over time:

```promql
avg_over_time(cpu_usage_percent[5m])
```

### 🧠 How PromQL Executes (Bottom → Up)

Take this:

```promql
avg_over_time(cpu_usage_percent[5m])
```

Execution:

1. `cpu_usage_percent` → fetch raw time series
2. `[5m]` → turn into range vector (last 5 minutes)
3. `avg_over_time()` → compute average of that window

👉 PromQL always evaluates inner parts first.

---

# 🔥 2️⃣ Real World Question:

## “Are users hitting my API more than usual?”

### 🧠 Business Meaning:

Traffic spike = good (marketing success) or bad (DDoS).

### ❌ Wrong way:

```promql
http_requests_total
```

This only shows cumulative counter.

### ✅ Correct way:

```promql
rate(http_requests_total[1m])
```

### 🧠 Execution Order:

1. `http_requests_total` → get counter values
2. `[1m]` → get last 1 minute samples
3. `rate()` → calculate per-second increase

Now you get:
👉 Requests per second

---

# 🔥 3️⃣ Real World Question:

## “Which endpoint is slow?”

Assume metric:

```
http_request_duration_seconds_bucket
```

### ✅ PromQL (P95 latency):

```promql
histogram_quantile(0.95,
  rate(http_request_duration_seconds_bucket[5m])
)
```

---

### 🧠 How It Executes (Bottom to Top):

Step by step:

1. `http_request_duration_seconds_bucket`
2. `[5m]`
3. `rate(...)`
4. `histogram_quantile(0.95, ...)`

Each outer function waits for inner to resolve.

---

# 🔥 4️⃣ Real World Question:

## “Which endpoint is most used?”

If metric has label `route`

```promql
sum(rate(http_requests_total[1m])) by (route)
```

---

### Execution:

1. `http_requests_total`
2. `[1m]`
3. `rate()`
4. `sum(...) by (route)`

👉 First calculate rate per series
👉 Then group by route
👉 Then sum

---

# 🔥 5️⃣ Real World Alert Question:

## “Alert me if CPU > 80% for 5 minutes”

```promql
avg_over_time(cpu_usage_percent[5m]) > 80
```

Execution:

1. Get CPU
2. Take 5m window
3. Average
4. Compare > 80
5. Return boolean vector

Prometheus alerts trigger if result = true.

---

# 🧠 How PromQL Thinks (Very Important)

PromQL works in layers:

```
Raw metric
↓
Range selector [5m]
↓
Transformation (rate, avg, increase)
↓
Aggregation (sum, avg by label)
↓
Comparison (> 80)
```

It always executes:

**Innermost → Outermost**

---

# 🧠 Now Let Me Challenge You (Real SRE Thinking)

Imagine your Node app is running on EC2.

Suddenly:

* CPU normal
* Traffic normal
* But users complain it's slow

What will you check?

Answer:

```promql
histogram_quantile(0.95,
  rate(http_request_duration_seconds_bucket[5m])
)
```

Because:
👉 CPU is not the problem
👉 Traffic is not the problem
👉 Latency is the problem

That’s real production debugging.

---

# 🧠 Think Like This From Now On

Instead of asking:

> “What is rate?”

Ask:

> “What business question am I answering?”

That mindset will make you very strong in DevOps / SRE interviews.
