# 🧭 Step 1: Start Grafana

If you're using docker-compose, add this (if not already):

```yaml
grafana:
  image: grafana/grafana:latest
  container_name: grafana
  ports:
    - "3001:3000"
  depends_on:
    - prometheus
```

Then:

```bash
docker-compose up -d
```

Now open:

```
http://localhost:3001
```

### Default login:

* Username: `admin`
* Password: `admin`

It will ask you to set a new password.

---

# 🧭 Step 2: Connect Prometheus to Grafana

After login:

1. Go to **Connections (⚙️) → Data Sources**
2. Click **Add Data Source**
3. Choose **Prometheus**
4. Set URL:

If using docker-compose:

```
http://prometheus:9090
```

If running Prometheus locally:

```
http://localhost:9090
```

5. Click **Save & Test**

If green → you’re ready ✅

---

# 🧭 Step 3: Create Your First Dashboard

Click:

➜ **Dashboards → New → Add Visualization**

Choose:
👉 Prometheus as data source

Now you can write PromQL queries.

---

# 🔥 First Real Dashboard (Beginner Setup)

Since you said you only have:

* CPU
* HTTP metrics
* User endpoint

Let’s build something real.

---

## 📊 1️⃣ CPU Usage Panel

Query:

```promql
avg(cpu_usage_percent)
```

Set:

* Visualization → Time series
* Unit → Percent (0–100)

Now you can see CPU over time.

---

## 📊 2️⃣ Requests Per Second Panel

```promql
rate(http_requests_total[1m])
```

This shows live traffic.

---

## 📊 3️⃣ Endpoint Usage Panel

```promql
sum(rate(http_requests_total[1m])) by (route)
```

Change visualization to:
👉 Bar chart

Now you see which route is used most.

---

## 📊 4️⃣ P95 Latency Panel

```promql
histogram_quantile(0.95,
  rate(http_request_duration_seconds_bucket[5m])
)
```

Unit → seconds (or milliseconds if needed)

Now you have real performance monitoring.

---

# 🧠 How Grafana Works Internally

Very simple:

```
User opens dashboard
↓
Grafana sends PromQL query to Prometheus
↓
Prometheus executes it
↓
Returns time series data
↓
Grafana renders graphs
```

Grafana does NOT store metrics.
Prometheus stores metrics.

Grafana is just the visualization layer.

---

# 🚀 Step 4: Make It Professional

Now you can:

### ✅ Add Variables

Example:

* Create variable: `route`
* Query:

```promql
label_values(http_requests_total, route)
```

Now dropdown lets you filter by endpoint.

---

### ✅ Add Alerts (Inside Grafana)

Inside panel → Alert → Create Alert Rule

Example:

```
avg_over_time(cpu_usage_percent[5m]) > 80
```

Alert if CPU > 80% for 5 minutes.

---

# 💡 Real Production Dashboard Layout

If this were your EC2 production app, your dashboard would look like:

1. CPU Usage
2. Memory Usage
3. Requests/sec
4. Error Rate
5. P95 latency
6. Top endpoints
7. Uptime

That’s a standard backend monitoring board.

---

# 🧠 Important For You (Since You're DevOps Learning)

Next level after this:

* Add Node Exporter (for EC2 system metrics)
* Add Alertmanager
* Send alerts to Telegram or Email
* Add Grafana Loki for logs
* Add tracing later (Jaeger / Tempo)

That becomes full observability stack.
