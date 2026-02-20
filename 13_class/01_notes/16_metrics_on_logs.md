# 🧠 What Does “Metrics on Logs” Mean?

It means:

> 📊 Creating numerical measurements (metrics) from your log data.

---

Logs = detailed events
Metrics = numbers you can graph

---

# 🧾 First Understand the Difference

## 📝 Logs

Example:

```json
{
  "level": "error",
  "message": "Database connection failed",
  "timestamp": "2026-02-19T10:30:00Z"
}
```

Logs tell you:

* What happened
* Exact message
* Full context

But logs are noisy.

---

## 📊 Metrics

Metrics are numbers like:

* 120 errors per minute
* 350 requests/sec
* 2.3s average response time
* 15 failed logins

Metrics are graph-friendly.

---

# 🎯 So What Is “Metrics on Logs”?

It means:

You take log entries and convert them into countable numbers.

Example:

Log says:

```
ERROR: Payment failed
ERROR: Payment failed
ERROR: Payment failed
```

Monitoring system converts this into:

```
Payment failures per minute = 3
```

That’s a metric derived from logs.

---

# 🏗 Real Example (Your WebSocket Room App)

Suppose your logs contain:

```
User joined room 1
User joined room 1
User joined room 2
User disconnected
```

You can create metrics like:

* Active users per room
* Joins per minute
* Disconnect rate
* Error rate

Even though originally it's just logs.

---

# 🔥 In New Relic Terms

New Relic can:

* Read logs
* Parse fields
* Count occurrences
* Create charts from them

For example:

NRQL query:

```sql
SELECT count(*) FROM Log WHERE level = 'error' TIMESERIES
```

That creates:

📊 Error rate graph

Even though it started from logs.

---

# 🧠 Why Not Just Use Logs?

Because logs are:

* Hard to visualize
* Hard to alert on
* Too detailed

Metrics are:

* Lightweight
* Easy to graph
* Good for alerts

---

# 📦 Real Production Flow

```
App → Structured Logs → Log platform
                      ↓
                Metrics extracted
                      ↓
               Graphs & Alerts
```

---

# 💡 Concrete Example

Your backend logs:

```js
logger.error("DB failed");
```

New Relic sees it.

It creates:

```
Metric: DB failures per minute
```

If count > 10 → trigger alert.

That is "metrics on logs".

---

# 🚀 Why This Is Powerful

Because sometimes:

You don’t instrument metrics in code.

But you already have logs.

So monitoring tools generate metrics automatically from logs.

---

# 🎯 Simple Summary

Logs = What happened
Metrics = How often it happens

Metrics on logs = Turning "what happened" into "how often it happened"