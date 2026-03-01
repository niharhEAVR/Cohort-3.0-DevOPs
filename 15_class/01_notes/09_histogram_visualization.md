# 🧠 First: What Is a Histogram in Prometheus?

When your Node app exposes a histogram, it does NOT store full request times.

Instead it stores:

* Buckets (`_bucket`) → counts of requests ≤ X seconds
* `_sum` → total time
* `_count` → total requests

Example bucket:

```
http_request_duration_seconds_bucket{le="0.1"}
http_request_duration_seconds_bucket{le="0.5"}
http_request_duration_seconds_bucket{le="1"}
http_request_duration_seconds_bucket{le="2"}
```

Each bucket is cumulative.

---

# 🔥 What Do You Actually Want To Visualize?

Usually in real systems we visualize:

1. Average latency
2. P95 latency
3. P99 latency
4. Request distribution

Let’s do them properly.

---

# ✅ 1️⃣ Visualize Average Request Duration

Use this query:

```promql
rate(http_request_duration_seconds_sum[5m])
/
rate(http_request_duration_seconds_count[5m])
```

### Why this works:

Bottom → Up execution:

1. Get `_sum`
2. Apply `rate()`
3. Get `_count`
4. Apply `rate()`
5. Divide

This gives rolling average over 5 minutes.

In Grafana:

* Visualization → Time series
* Unit → seconds (or ms)

---

# ✅ 2️⃣ Visualize P95 Latency (Most Important)

This is what companies monitor.

```promql
histogram_quantile(
  0.95,
  rate(http_request_duration_seconds_bucket[5m])
)
```

Execution:

1. Get bucket series
2. Apply `rate()`
3. Pass into `histogram_quantile`
4. Compute 95th percentile

This shows:
👉 95% of requests are faster than this value

Set unit → seconds or milliseconds.

---

# ✅ 3️⃣ Visualize P99

```promql
histogram_quantile(
  0.99,
  rate(http_request_duration_seconds_bucket[5m])
)
```

Good for performance-sensitive systems.

---

# ✅ 4️⃣ Visualize Request Distribution (Bucket View)

If you want to see distribution across buckets:

```promql
sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
```

Change visualization to:

👉 Bar chart

This shows how requests are distributed by latency bucket.

---

# 🧠 If You Have Multiple Routes

If metric has label `route`, use:

```promql
histogram_quantile(
  0.95,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route)
)
```

Now you can see P95 per route.

Very powerful.

---

# 🔥 Important: Why We Always Use `rate()` With Histograms

Buckets are counters.

If you don’t use `rate()`:

❌ You’ll see increasing numbers
❌ Not actual latency

Always use:

```
rate(bucket[window])
```

Then apply:

```
histogram_quantile()
```

---

# 🧠 Real Production Dashboard Layout For Latency

I would create 3 panels:

Panel 1:

```
Average latency
```

Panel 2:

```
P95 latency
```

Panel 3:

```
P99 latency
```

Optional:

```
Latency distribution (bar)
```

That’s a professional backend latency board.

---

# 🚀 Debug Scenario For You

If:

* CPU normal
* Traffic normal
* Users say app slow

Check:

```
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

If P95 high → you found the problem.

That’s real-world debugging.




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
---
---
---
---
---
---
---





I can see your query in Grafana Builder:

```promql
histogram_quantile(
  0.95,
  rate(http_request_duration_ms_bucket{route="/metrics"}[$__rate_interval])
)
```

Let’s break this down clearly and make sure you fully understand what you’re visualizing.

---

# 🔍 What Your Current Query Is Doing

### Step-by-step (bottom → top execution):

1️⃣ `http_request_duration_ms_bucket{route="/metrics"}`
→ Fetch histogram buckets only for `/metrics` route.

2️⃣ `[$__rate_interval]`
→ Select recent time window (Grafana auto-calculates it based on dashboard time range).

3️⃣ `rate(...)`
→ Convert bucket counters into per-second increments.

4️⃣ `histogram_quantile(0.95, …)`
→ Compute 95th percentile latency.

✅ Result:
**P95 latency for the `/metrics` endpoint**

---

# 🧠 Why This Is Good

This shows:

> 95% of `/metrics` requests complete faster than X ms

If this number increases → your endpoint is slowing down.

---

# 🚀 Now Let’s Improve It

## 🔥 1️⃣ Remove Route Filter (See All Routes)

Right now you are filtering only `/metrics`.

If you want P95 per route:

```promql
histogram_quantile(
  0.95,
  sum(
    rate(http_request_duration_ms_bucket[$__rate_interval])
  ) by (le, route)
)
```

Now you will see:

* One line per route
* Much more useful in real apps

---

## 🔥 2️⃣ If You Want Only One Global P95

```promql
histogram_quantile(
  0.95,
  sum(
    rate(http_request_duration_ms_bucket[$__rate_interval])
  ) by (le)
)
```

This gives total app P95 latency.

---

# 🎨 How To Visualize Properly in Grafana

For percentile latency:

* Visualization → **Time series**
* Unit → **milliseconds (ms)** (important!)
* Legend → `{{route}}` (if grouping by route)

If it looks noisy:

* Increase time range
* Increase rate window (e.g. `[5m]` instead of `$__rate_interval`)

---

# 🧠 Common Beginner Mistake

If you forget `sum by (le, route)`:

Percentile calculation will be wrong.

Because `histogram_quantile` needs:

```
Grouped by le
```

That’s very important.

---

# 🧪 If Graph Shows Weird Spikes

Try:

```promql
histogram_quantile(
  0.95,
  sum(
    rate(http_request_duration_ms_bucket[5m])
  ) by (le)
)
```

Sometimes fixed window is more stable than auto interval.

---

# 💡 Small Reality Check

You’re currently visualizing `/metrics` route.

That’s Prometheus scraping endpoint itself 😄
It’s usually very fast and not important.

Better to visualize:

* `/login`
* `/api/*`
* `/users`
* `/checkout`

---

# 🏆 You’re Doing It Right

You already:

* Set rate
* Used histogram_quantile
* Filtered label
* Used $__rate_interval

That’s proper usage.
