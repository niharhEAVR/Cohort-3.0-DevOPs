Let’s create:

> 🚨 “Alert if CPU > 80% for 5 minutes”

---

# ✅ 1️⃣ Enter Alert Rule Name

This is just the title.

Example:

```
High CPU Usage - Node App
```

💡 Keep names descriptive. In production, clear names save you during emergencies.

---

# ✅ 2️⃣ Define Query and Alert Condition

This is the **most important section**.

### Step A — Write the Query

```promql
avg_over_time(cpu_usage_percent[5m])
```

What this does:

* Gets CPU metric
* Looks at last 5 minutes
* Calculates average

### Step B — Set Condition

Below query, choose:

```
WHEN A IS ABOVE 80
```

This means:
If CPU average > 80 → condition becomes true.

---

# ✅ 3️⃣ Add Folder and Labels

### Folder

Just organizational.
Create something like:

```
Node-App-Monitoring
```

### Labels (Very Important in Real World)

Add:

```
severity = critical
service = node-app
environment = dev
```

Labels help:

* Route alerts
* Filter alerts
* Organize alerts

In big companies, labels are extremely important.

---

# ✅ 4️⃣ Set Evaluation Behavior

This controls **how often Grafana checks the rule**.

Example:

* Evaluate every: `1m`
* For: `5m`

Meaning:
If condition stays true for 5 minutes → fire alert.

Without "For" duration, you’ll get too many noisy alerts.

---

# ✅ 5️⃣ Configure Notifications

Choose your contact point:

* Email
* Telegram
* Slack
* Webhook

Select the one you created earlier.

If none created → go to Contact Points and create one first.

---

# ✅ 6️⃣ Configure Notification Message

This is what gets sent.

You can customize it like:

```
🚨 High CPU detected!

Service: {{ $labels.service }}
Value: {{ $values.A }}

Please investigate immediately.
```

Grafana supports template variables:

* `{{ $labels.* }}`
* `{{ $values.A }}`

This makes alerts dynamic.

---

# 🧠 What Happens Internally

Every 1 minute:

```text
Grafana → Executes PromQL
          ↓
Gets result from Prometheus
          ↓
Checks condition
          ↓
If true for 5m
          ↓
Alert state = FIRING
          ↓
Notification sent
```

---

# 🔥 Another Real Alert You Should Create

Since you're running a backend:

### 🚨 No Traffic Alert

Query:

```promql
rate(http_requests_total[1m])
```

Condition:

```
IS BELOW 0.1
FOR 3m
```

This tells you:
If your app stops receiving traffic.

Very useful in production.

---

# 💡 Golden Rule (Important)

Never alert on raw metrics.

Always:

* Use `rate()` for counters
* Use `avg_over_time()` for stability
* Use duration ("For") to avoid noise
