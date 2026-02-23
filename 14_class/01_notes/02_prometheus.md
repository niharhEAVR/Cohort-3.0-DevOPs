# 1️⃣ What is Prometheus?

**Prometheus** is an open-source monitoring and alerting system used to collect, store, and query metrics from applications and infrastructure.

It was originally developed at **SoundCloud** and is now maintained by the **Cloud Native Computing Foundation**.

### Simple Definition

> Prometheus collects numeric metrics over time and allows you to monitor, analyze, and alert on system behavior.

It is especially popular in:

* Microservices
* Docker environments
* Kubernetes systems
* Cloud-native architectures

---

# 2️⃣ What Problem Does Prometheus Solve?

When your application is running in production, you need to know:

* Is CPU usage high?
* Is memory leaking?
* Are APIs slow?
* Are errors increasing?
* Are requests spiking?
* Is a server down?

Without monitoring → You only find out when users complain.
With Prometheus → You detect issues early and automatically.

---

# 3️⃣ Core Concepts of Prometheus

To truly understand it, you must understand these 6 building blocks:

1. Metrics
2. Pull model
3. Time-series database
4. Labels
5. PromQL
6. Alerting

Let’s go step by step.

---

# 4️⃣ Metrics (The Heart of Prometheus)

Prometheus does NOT store logs.
It stores **metrics**.

Metrics are numeric measurements over time.

Examples:

* CPU usage → 75%
* Memory usage → 512MB
* HTTP requests → 1500
* API latency → 120ms
* Error rate → 2%

Metrics are lightweight and efficient, which makes Prometheus extremely fast.

---

# 5️⃣ Pull-Based Architecture

Prometheus uses a **pull model**.

Instead of your app sending data, Prometheus periodically asks for it.

Your app exposes an endpoint like:

```
/metrics
```

Prometheus scrapes that endpoint every few seconds.

This has advantages:

* Centralized control
* Easier debugging
* No metric flooding
* Service discovery compatibility

---

# 6️⃣ Time-Series Database (TSDB)

Prometheus stores data in a built-in Time-Series Database.

Each data point is stored as:

```
metric_name{label="value"}  value  timestamp
```

Example:

```
http_requests_total{method="GET",status="200"}  1540
```

It means:

* Metric: http_requests_total
* Labels: method=GET, status=200
* Value: 1540
* Stored with timestamp

That’s why it’s called time-series monitoring.

---

# 7️⃣ Labels (Very Important)

Labels make Prometheus powerful.

Example:

```
http_requests_total{method="GET",status="500",instance="server1"}
```

Now you can filter:

* Only 500 errors
* Only GET requests
* Only server1

Labels allow high-dimensional data filtering without changing metric names.

This is one of Prometheus’s biggest strengths.

---

# 8️⃣ PromQL (Query Language)

Prometheus has its own query language called PromQL.

Examples:

### Total requests

```
http_requests_total
```

### Requests per second

```
rate(http_requests_total[1m])
```

### 95th percentile latency

```
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

This is how p95 and p99 values are calculated.

PromQL allows:

* Aggregations
* Filtering
* Percentiles
* Rate calculations
* Time window analysis

It is very powerful but takes practice to master.

---

# 9️⃣ Alerting System

Prometheus can define alert rules such as:

* CPU > 90% for 5 minutes
* Error rate > 5%
* Server down
* Memory > 80%

Alerts are sent to **Alertmanager**, which handles:

* Slack notifications
* Email
* PagerDuty
* Telegram

Alertmanager also:

* Groups alerts
* Prevents alert spam
* Handles silencing

---

# 🔟 Visualization

Prometheus stores data but does not provide advanced dashboards by itself.

For visualization, it integrates with **Grafana**.

Prometheus = Data engine
Grafana = Dashboard UI

This combination is extremely common in production systems.

---

# 1️⃣1️⃣ Exporters

Prometheus collects metrics using exporters.

Exporter = A service that exposes metrics in Prometheus format.

Common exporters:

* Node Exporter → CPU, RAM, disk
* Nginx Exporter → HTTP metrics
* Redis Exporter → Redis metrics
* MySQL Exporter → Database metrics

Your Node.js app can also expose its own metrics using a client library.

---

# 1️⃣2️⃣ How It Works in Real Production

Let’s say you deploy a backend on AWS:

1. Your Node app exposes `/metrics`
2. Prometheus scrapes every 15 seconds
3. Data is stored in TSDB
4. Grafana shows:

   * Request rate
   * Latency
   * Error rate
5. If error rate spikes → Alertmanager sends Slack notification

This is how real companies monitor systems.

---

# 1️⃣3️⃣ Prometheus vs Logs vs APM

Important distinction:

| Tool       | Purpose                    |
| ---------- | -------------------------- |
| Prometheus | Numeric metrics            |
| ELK        | Logs                       |
| APM tools  | Tracing & deep performance |
| New Relic  | Managed monitoring         |

Prometheus focuses strictly on metrics.

---

# 1️⃣4️⃣ Why It Is So Popular in DevOps

Prometheus became standard in cloud-native systems because:

* Works extremely well with **Kubernetes**
* Label-based flexible querying
* Pull-based architecture
* Powerful query language
* Open-source and free
* Highly scalable

If someone is doing serious DevOps, they will likely know Prometheus.

---

# 1️⃣5️⃣ When Should You Use It?

Use Prometheus when:

* You run microservices
* You use Docker
* You deploy on cloud
* You need infrastructure monitoring
* You want full control instead of SaaS

---

# 1️⃣6️⃣ Limitations

Prometheus is not perfect:

* Not ideal for long-term storage (usually 15–30 days default)
* Not a log storage system
* Requires setup and maintenance
* Can become complex at large scale

For long-term storage, people use:

* Thanos
* Cortex
* VictoriaMetrics

---

# Final Summary

Prometheus is:

* A metrics collection system
* A time-series database
* A monitoring and alerting engine
* Pull-based
* Label-driven
* Queryable with PromQL
* Commonly paired with Grafana
* Core tool in modern DevOps
