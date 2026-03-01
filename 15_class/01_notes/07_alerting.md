# 🟢 First: Understand How Grafana Alerting Works

Grafana alert flow:

```
Metric → PromQL Query → Condition → Alert Rule → Contact Point → Notification
```

Grafana:

* Runs your PromQL query
* Evaluates condition
* If true for X time → sends alert

---

# 🧭 Step 1: Go To Alerting Section

In Grafana sidebar:

👉 **Alerting (bell icon)**
👉 Click **Alert rules**
👉 Click **New alert rule**

---

# 🧭 Step 2: Write the Query

Choose:

* Data source → **Prometheus**

Now write your PromQL.

Let’s create a real alert 👇

---

# 🔥 Example 1 – CPU High Alert

## 🧠 Real-world Question:

“Alert me if CPU is above 80% for 5 minutes”

### Query:

```promql
avg_over_time(cpu_usage_percent[5m])
```

Now below that, set:

Condition:

```
WHEN query(A) IS ABOVE 80
```

Evaluation:

* Evaluate every: 1m
* For: 5m

That means:
If CPU average > 80 for 5 continuous minutes → trigger alert.

---

# 🔥 Example 2 – Traffic Drop Alert

“What if my app suddenly stops getting traffic?”

```promql
rate(http_requests_total[1m])
```

Condition:

```
IS BELOW 0.1
FOR 3m
```

If traffic drops unexpectedly → alert fires.

Very useful in production.

---

# 🔥 Example 3 – Latency Alert (Professional)

```promql
histogram_quantile(0.95,
  rate(http_request_duration_seconds_bucket[5m])
)
```

Condition:

```
IS ABOVE 1
FOR 5m
```

If P95 latency > 1 second → alert.

Now you're thinking like backend performance engineer.

---

# 🧭 Step 3: Create Contact Point (Where Alert Goes)

Now go to:

👉 Alerting → Contact points
👉 Add contact point

You can choose:

* Email
* Telegram
* Slack
* Webhook
* Discord

For example, Telegram is popular.

---

## 🟢 Telegram Setup Quick Method

1. Create Telegram bot via @BotFather
2. Get Bot Token
3. Get Chat ID
4. Add contact point in Grafana:

   * Type: Telegram
   * Paste token
   * Paste chat ID

Save.

---

# 🧭 Step 4: Create Notification Policy

Go to:

👉 Alerting → Notification policies

Set:

* Default route → your contact point

Now alerts will send there.

---

# 🧠 Important: How Alert Execution Works Internally

When alert rule runs:

```
1. Grafana executes PromQL
2. Prometheus returns vector
3. Grafana checks condition
4. If true continuously for X duration
5. Alert state = FIRING
6. Notification sent
```

States:

* Normal
* Pending
* Firing
* Resolved

---

# 🟡 Common Beginner Mistake

If alert not firing:

Check:

* Time range
* Evaluation interval
* Query returning data?
* Prometheus reachable?
* Contact point configured?

---

# 🚀 Pro Tip For You (Since You're Learning DevOps Seriously)

In real production:

We don’t alert on:
❌ CPU > 80 for 10 seconds
❌ One failed request

We alert on:
✅ Sustained issues
✅ User impact metrics
✅ Latency percentiles
✅ Error rate spikes

---

# 🧠 Next Level After This

After you’re comfortable:

* Add Alertmanager (for advanced routing)
* Add silence feature
* Add severity labels (critical, warning)
* Send alerts to multiple teams
* Create synthetic health check alerts
