```text
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/metrics",status_code="200"} 32
http_requests_total{method="GET",route="/cpu",status_code="304"} 2

# HELP active_http_requests Number of currently active HTTP requests
# TYPE active_http_requests gauge
active_http_requests 1

# HELP http_request_duration_ms Duration of HTTP requests in ms
# TYPE http_request_duration_ms histogram
http_request_duration_ms_bucket{le="0.1",method="GET",route="/metrics",status_code="200"} 0
http_request_duration_ms_bucket{le="5",method="GET",route="/metrics",status_code="200"} 31
http_request_duration_ms_bucket{le="15",method="GET",route="/metrics",status_code="200"} 32
http_request_duration_ms_bucket{le="50",method="GET",route="/metrics",status_code="200"} 32
http_request_duration_ms_bucket{le="100",method="GET",route="/metrics",status_code="200"} 32
http_request_duration_ms_bucket{le="300",method="GET",route="/metrics",status_code="200"} 32
http_request_duration_ms_bucket{le="500",method="GET",route="/metrics",status_code="200"} 32
http_request_duration_ms_bucket{le="1000",method="GET",route="/metrics",status_code="200"} 32
http_request_duration_ms_bucket{le="3000",method="GET",route="/metrics",status_code="200"} 32
http_request_duration_ms_bucket{le="5000",method="GET",route="/metrics",status_code="200"} 32
http_request_duration_ms_bucket{le="+Inf",method="GET",route="/metrics",status_code="200"} 32
http_request_duration_ms_sum{method="GET",route="/metrics",status_code="200"} 52.252400000000016
http_request_duration_ms_count{method="GET",route="/metrics",status_code="200"} 32
http_request_duration_ms_bucket{le="0.1",method="GET",route="/cpu",status_code="304"} 0
http_request_duration_ms_bucket{le="5",method="GET",route="/cpu",status_code="304"} 0
http_request_duration_ms_bucket{le="15",method="GET",route="/cpu",status_code="304"} 0
http_request_duration_ms_bucket{le="50",method="GET",route="/cpu",status_code="304"} 0
http_request_duration_ms_bucket{le="100",method="GET",route="/cpu",status_code="304"} 0
http_request_duration_ms_bucket{le="300",method="GET",route="/cpu",status_code="304"} 0
http_request_duration_ms_bucket{le="500",method="GET",route="/cpu",status_code="304"} 0
http_request_duration_ms_bucket{le="1000",method="GET",route="/cpu",status_code="304"} 0
http_request_duration_ms_bucket{le="3000",method="GET",route="/cpu",status_code="304"} 2
http_request_duration_ms_bucket{le="5000",method="GET",route="/cpu",status_code="304"} 2
http_request_duration_ms_bucket{le="+Inf",method="GET",route="/cpu",status_code="304"} 2
http_request_duration_ms_sum{method="GET",route="/cpu",status_code="304"} 4463.4472000000005
http_request_duration_ms_count{method="GET",route="/cpu",status_code="304"} 2
```


---

# 🔹 First Block: `/metrics` Route

```
http_request_duration_ms_bucket{le="5",route="/metrics"} 31
...
http_request_duration_ms_count{route="/metrics"} 32
http_request_duration_ms_sum{route="/metrics"} 52.25
```

Let’s interpret it.

---

## 1️⃣ `_count = 32`

```
http_request_duration_ms_count{...} 32
```

You called `/metrics` **32 times**.

That means 32 observations were recorded.

---

## 2️⃣ `_sum = 52.25`

```
http_request_duration_ms_sum{...} 52.25
```

Total time of all 32 requests combined:

≈ **52.25 ms**

So average duration is:

```
52.25 / 32 ≈ 1.63 ms
```

So `/metrics` is extremely fast.

---

## 3️⃣ Bucket Breakdown

```
le="5"  → 31
le="15" → 32
le="50" → 32
...
le="+Inf" → 32
```

Important concept:

Buckets are **cumulative**.

Meaning:

```
le="5" = 31
```

means 31 requests were ≤ 5 ms.

```
le="15" = 32
```

means 32 requests were ≤ 15 ms.

So:

* 31 requests ≤ 5ms
* 1 request between 5ms and 15ms
* None above 15ms

That matches the small total sum.

---

# 🔹 Second Block: `/cpu` Route

Now look at:

```
http_request_duration_ms_count{route="/cpu"} 2
http_request_duration_ms_sum{route="/cpu"} 4463.44
```

You called `/cpu` 2 times.

Total duration ≈ 4463 ms.

Average:

```
4463 / 2 ≈ 2231 ms
```

So roughly 2.2 seconds per request.

That matches your random delay (0–5000ms).

---

## Bucket Breakdown for `/cpu`

```
le="3000" → 2
le="5000" → 2
le="+Inf" → 2
```

What does that mean?

Both requests were:

* ≤ 3000 ms
* ≤ 5000 ms
* ≤ +Inf

But look at earlier buckets:

```
le="1000" → 0
```

So:

Both requests were **above 1000ms**.

Most likely around:

~2000–3000 ms.

That aligns perfectly with your average (~2231ms).

---

# 🔹 Why Status Code 304?

You see:

```
status_code="304"
```

304 = Not Modified.

That means your browser cached `/cpu` response and did a conditional request.

So Express responded 304 instead of 200.

That’s normal browser behavior.

If you test with curl:

```
curl http://localhost:3000/cpu
```

You’ll probably see 200 instead.

---

# 🔹 Big Picture Understanding

For `/metrics`:

* Fast
* Almost all requests under 5ms
* 32 total requests
* Total time small

For `/cpu`:

* Slow
* 2 requests
* Both around ~2–3 seconds
* Bucket distribution reflects that

---

# 🔥 What This Shows

Your histogram is working perfectly.

It correctly:

* Separates metrics by route
* Separates metrics by status code
* Records distribution
* Tracks sum
* Tracks count

This is exactly how production histograms look.

---

# 🧠 Most Important Concept Here

Buckets are cumulative.

If:

```
le="3000" = 2
```

That does NOT mean both were exactly 3000ms.

It means:

Both were ≤ 3000ms.

To know how many were between 1000–3000ms:

You subtract:

```
bucket_3000 - bucket_1000
```

---

# 🔹 If You Now Hit `/cpu` 10 More Times

You’ll see:

* `_count` increases to 12
* `_sum` increases
* Bucket counts redistribute
* p95 becomes meaningful

Right now p95 is meaningless because only 2 samples.
