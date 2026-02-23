# Let’s understand why your `for` loop didn’t show the gauge properly, but `setTimeout` (Promise delay) did.

---

# 🔹 1️⃣ The Core Reason: Node.js Is Single-Threaded

Node.js runs JavaScript in **one main thread**.

That means:

* If you run a CPU-heavy loop
* That thread is completely blocked
* Nothing else can execute during that time

Including:

* Other requests
* Middleware
* Prometheus scraping

---

# 🔹 2️⃣ What Happens With Your CPU Loop?

Example:

```ts
for (let i = 0; i < 1_000_000_000; i++) {
    Math.random();
}
```

What happens internally?

1. Request starts → `activeRequestsGauge.inc()`
2. CPU loop blocks event loop
3. No other requests can be processed
4. No other middleware runs
5. Prometheus cannot scrape
6. After loop finishes → response ends → `dec()`

So the gauge might briefly be 1.

But:

Since event loop was blocked, Prometheus couldn't scrape during that time.

By the time it scrapes again:

```text
active_http_requests = 0
```

So you never see it.

---

# 🔹 3️⃣ Why `setTimeout` Works

When you do:

```ts
await new Promise(resolve => setTimeout(resolve, 5000));
```

This is non-blocking.

Here’s what happens:

1. Request starts → `inc()`
2. Timer is registered
3. Event loop is free
4. Other requests can come
5. Prometheus can scrape
6. Gauge remains > 0 for 5 seconds
7. After timeout → response ends → `dec()`

Now Prometheus has enough time to observe the non-zero value.

---

# 🔥 The Real Difference

| CPU Loop                 | Promise Timeout       |
| ------------------------ | --------------------- |
| Blocks event loop        | Does not block        |
| No concurrency           | Allows concurrency    |
| Prometheus cannot scrape | Prometheus can scrape |
| Gauge not visible        | Gauge visible         |

---

# 🔹 4️⃣ Even If You Increase Loop Count?

If you increase loop count massively:

```ts
for (let i = 0; i < 10_000_000_000; i++) {}
```

Two things happen:

1. Your server freezes
2. Prometheus cannot scrape during freeze

So again:

You won’t see meaningful gauge spikes.

---

# 🔹 5️⃣ Important Production Insight

Prometheus measures:

👉 What the system can observe
👉 At scrape time

If the event loop is blocked, monitoring also pauses.

This is actually useful:

If your event loop blocks,
Prometheus will show:

* Increased latency
* Possibly missed scrapes
* Alert on target down

---

# 🔹 6️⃣ Why CPU Loop Is Bad In Real Apps

CPU-heavy tasks should:

* Run in worker threads
* Use separate services
* Use background job queues

Not block your API server.

Because blocking:

* Stops monitoring
* Stops handling requests
* Kills scalability

---

# 🔹 7️⃣ If You Want To See Gauge Spike Properly

Best way:

```ts
app.get("/slow", async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    res.send("done");
});
```

Then open 5 tabs.

Now:

```promql
active_http_requests
```

You’ll clearly see spike to 5.

---

# 🧠 Deep Insight

Monitoring systems observe:

* What the system can report
* At the time they scrape

If your system is frozen,
Monitoring is frozen too.

That’s normal.

---

You just learned something very important:

CPU blocking in Node
affects not only performance,
but also observability.