# ✅ 1️⃣ Are Labels Fixed to Only 3?

Short answer:

❌ No.
You can define **any number of labels**.

In your example:

```ts
labelNames: ['method', 'route', 'status_code']
```

You chose 3 labels.

You could also do:

```ts
labelNames: ['method', 'route', 'status_code', 'instance', 'version', 'region']
```

Prometheus does not limit you to 3.

---

## ⚠️ But There Is a Big Rule

More labels = more **cardinality**.

And high cardinality = performance problems.

---

## 🔥 What Is Cardinality?

Each unique combination of labels creates a new time series.

Example:

```text
http_requests_total{method="GET",route="/login",status_code="200"}
http_requests_total{method="GET",route="/login",status_code="500"}
http_requests_total{method="POST",route="/login",status_code="200"}
```

That’s already 3 time series.

Now imagine:

* 10 routes
* 5 status codes
* 2 methods
* 4 instances

Total time series:

```text
10 × 5 × 2 × 4 = 400
```

And that’s just one metric.

---

## ❌ What You Should NEVER Do

Don’t use labels like:

```ts
labelNames: ['user_id']
```

Why?

Because if you have 1 million users:

You just created 1 million time series.

Prometheus will explode.

---

## ✅ Safe Label Examples

* method
* route
* status_code
* instance
* region
* service

These are bounded and controlled.

---

# ✅ 2️⃣ What Happens If Machine Goes Down?

Excellent question.

Let’s analyze carefully.

---

## Scenario:

Your app restarts.

Your Counter:

```ts
http_requests_total
```

Resets to 0.

Yes — this is normal.

Counters live in memory.

When process dies → memory resets.

---

## ❓ So Do We Lose Data?

No. Not exactly.

Here’s why.

Prometheus stores historical values in its TSDB.

Example timeline:

| Time       | Value |
| ---------- | ----- |
| 10:00      | 500   |
| 10:01      | 550   |
| 10:02      | 600   |
| 💥 Restart |       |
| 10:03      | 5     |
| 10:04      | 20    |

Notice drop from 600 → 5.

Prometheus detects this as a **counter reset**.

---

## 🔥 How Does UI Catch Up?

Prometheus functions like:

```promql
rate(http_requests_total[1m])
```

Are smart.

They detect resets and calculate correctly.

So even if:

```text
600 → 5
```

Prometheus understands:
This is restart, not negative traffic.

And it calculates the rate properly.

---

## 🧠 Important Insight

You should NEVER directly look at:

```promql
http_requests_total
```

In dashboards.

You should always use:

```promql
rate(http_requests_total[5m])
```

Or:

```promql
increase(http_requests_total[5m])
```

Because counters are cumulative.

---

# 🚨 But What If Prometheus Itself Goes Down?

Different problem.

If Prometheus goes down:

* It stops scraping
* There will be a data gap
* No backfilling

Because Prometheus uses **pull model**.

Apps do NOT buffer metrics.

So:

Downtime = missing data.

---

# 🔥 Production Solution

Large systems:

* Run Prometheus in HA (2 instances)
* Use persistent disk
* Use Thanos for long-term storage

---

# 🎯 So Answering You Directly

> Are labels limited to 3?

No.
But you must control cardinality.

---

> If machine restarts, do we lose total count?

Yes, in memory.
But Prometheus detects reset.

Using `rate()` handles it automatically.

You don’t lose historical graphs.

---

# 🧠 Final Concept You Must Remember

Counter is not about total value.
It is about rate over time.

That’s why resets are safe.
