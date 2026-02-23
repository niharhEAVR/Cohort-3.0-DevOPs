# 🔹 1️⃣ Does Every Endpoint Create Its Own Buckets?

Short answer:

✅ **Yes — for every unique combination of labels, Prometheus creates a separate histogram series.**

In your code, your labels are:

```ts
labelNames: ['method', 'route', 'status_code']
```

So each unique combination of:

* HTTP method
* Route
* Status code

creates a **separate histogram series**.

---

## Example

If you visit:

```
GET /user → 200
GET /cpu → 200
GET /metrics → 200
POST /user → 201
```

Prometheus creates separate bucket sets like:

```
http_request_duration_ms_bucket{method="GET",route="/user",status_code="200"}
http_request_duration_ms_bucket{method="GET",route="/cpu",status_code="200"}
http_request_duration_ms_bucket{method="GET",route="/metrics",status_code="200"}
http_request_duration_ms_bucket{method="POST",route="/user",status_code="201"}
```

Each of these has its own:

* `_bucket`
* `_sum`
* `_count`

So yes — **every endpoint effectively gets its own histogram.**

---

# 🔹 2️⃣ Will It Create Buckets For “Everyone”?

This depends on your labels.

If your label is:

```ts
route: req.route?.path
```

Then routes look like:

```
/user
/cpu
```

That’s good.

---

## ⚠️ Dangerous Case (Cardinality Explosion)

If instead you did:

```ts
route: req.path
```

And you had dynamic routes like:

```
/user/1
/user/2
/user/3
/user/99999
```

Now Prometheus creates:

```
route="/user/1"
route="/user/2"
route="/user/3"
...
```

That means **every user ID creates a new histogram series.**

If you have 1 million users → you create 1 million time series.

That will destroy Prometheus memory.

---

# 🔹 3️⃣ So What Actually Happens Internally?

For each unique label combination:

Prometheus stores:

* N buckets
* 1 sum
* 1 count

So if you have:

* 10 routes
* 2 methods
* 5 status codes

Total combinations:

```
10 × 2 × 5 = 100 histogram series
```

Each series contains:

```
(number_of_buckets + 2) time series
```

Because each histogram produces:

* bucket series
* sum series
* count series

So histograms multiply your metric storage quickly.

---

# 🔹 4️⃣ Does That Mean Every Page Visit Creates Something?

Yes — but only for **new label combinations**.

If you repeatedly visit:

```
GET /cpu 200
```

It does NOT create new series.

It just increments the existing one.

New series are created only when:

* New route
* New method
* New status code

appears for the first time.

---

# 🔹 5️⃣ In Your Current Setup

You will get separate histograms for:

```
GET /user 200
GET /cpu 200
GET /cpu 304
GET /metrics 200
```

That’s totally normal.

And actually desirable.

Because:

You want to compare latency per endpoint.

---

# 🔹 6️⃣ Real Production Best Practice

Most companies:

* Keep labels small and controlled
* Avoid dynamic values
* Avoid user_id, request_id, etc.
* Use normalized routes like `/user/:id`

Because histograms can explode storage if misused.

---

# 🔥 Final Clear Answer

Yes — each endpoint (route + method + status combination) gets its own histogram bucket set.

But:

It only creates new series for new label combinations.

Repeated visits just increase counts — they do NOT create new buckets.
