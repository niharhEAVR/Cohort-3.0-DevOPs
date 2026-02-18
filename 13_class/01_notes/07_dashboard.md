# ⭐ **What is New Relic’s Dashboard?**

New Relic’s dashboard is a **centralized monitoring view** where you can see **everything happening inside your servers, containers, applications, and infrastructure** in one place.

Think of it like:

### 👉 A *real-time control panel* for your entire system.

It shows:

* your VM’s health
* CPU usage
* memory usage
* disk usage
* network traffic
* container status
* Node.js performance
* errors
* logs
* alerts
* APM traces
* events

Everything is visible through graphs, charts, and tables.

---

# ⭐ **Why does New Relic have its own Dashboard? (Purpose)**

Because New Relic collects a **huge amount of data**, and you need a way to *see it*, *analyze it*, and *make decisions*.

The purpose of the dashboard is:

---

## 🛠 **1. To visualize your system’s behavior**

Instead of running commands like:

```
htop
ps aux
docker ps
iostat
netstat
```

You can see all this visually in one screen.

New Relic converts raw metrics to:

* CPU graphs
* memory graphs
* container lists
* process lists
* error statistics

This makes understanding fast and simple.

---

## ⚠️ **2. To detect problems early**

If your system has issues like:

* high CPU
* memory leaks
* container crashes
* slow API responses
* high latency
* network issues

New Relic dashboard shows **spikes**, **dips**, and **alerts**.

So you know something is wrong *before your users complain*.

---

## 📈 **3. To track performance over time**

You can check:

* CPU usage for last 24 hours
* server load for last 7 days
* number of containers running week-to-week
* traffic patterns
* error growth

Companies use this to:

* plan scaling
* spot bottlenecks
* understand trends

---

## 👨‍💻 **4. To monitor multiple servers at once**

If you have **10 VMs**, New Relic dashboard shows all of them.

If you have **50 containers**, it shows all.

If you have:

* Database server
* API server
* Worker server
* Queue server
* Logging server

New Relic shows them separately and together.

---

## 🧠 **5. To debug issues quickly**

Example:

Your API becomes slow.

With New Relic dashboard, you can instantly see:

* which endpoint is slow
* which query is slow
* which process used CPU
* which container is failing
* which database call took long

This saves hours of debugging.

---

## 🚨 **6. To configure monitoring alerts**

You can tell New Relic:

> “Send an alert if CPU > 80% for 5 minutes”

Or:

* Memory > 90%
* Disk < 10 GB left
* Node.js errors > 100/min
* API latency > 200ms
* Container restarted

New Relic will send:

* Email
* SMS
* Slack message
* PagerDuty alert

---

## 📊 **7. To create custom dashboards**

Teams create dashboards like:

* “API Health Dashboard”
* “Database Performance Dashboard”
* “Kubernetes Dashboard”
* “Business Metrics Dashboard”
* “DevOps Team Dashboard”

These dashboards combine all needed graphs in one place.

---

# ⭐ **In short: New Relic’s dashboard is for visibility + monitoring + debugging + alerts**

### It helps you answer questions like:

✔ Is my server healthy?
✔ Is CPU too high?
✔ Are containers running fine?
✔ Are Node.js APIs slow?
✔ Are there any errors?
✔ What happened last night at 2 AM?
✔ Why did the app go down yesterday?
✔ Which server needs scaling?

This is why New Relic is used by:

* DevOps
* SRE
* Backend engineers
* Cloud engineers
* Infrastructure teams

---

# 🎯 **Your mental model:**

### **New Relic Agent = Collects data**

### **New Relic Dashboard = Shows data**

Agent = data producer
Dashboard = data viewer

---
---
---
---

# ⭐ **How to Start Creating Your Own Dashboard in New Relic**

New Relic gives you a blank canvas where *you decide what data to show* — CPU, memory, API response time, logs, errors, container usage, etc.

Dashboards in New Relic are made from **widgets** (charts).

Let’s go step by step.

---

# ✅ **Step 1: Go to Dashboards**

Inside New Relic:

1. From the left side menu
2. Click **"Dashboards"**
3. Click **“+ Create dashboard”**

You will now get a clean empty dashboard.

---

# ✅ **Step 2: Choose a Name**

Give it a meaningful name like:

* “My VM Dashboard”
* “Node Server Health”
* “Monitoring Classroom Dashboard”
* “DevOps Practice Dashboard”

This helps you stay organized.

---

# ✅ **Step 3: Add Your First Widget**

A widget can be:

* a CPU chart
* memory chart
* container count
* disk usage
* number of processes
* API response time
* logs panel

Click:

**Add widget → Add chart**

---

# ⭐ **How do charts actually work?**

Every chart in New Relic is based on **NRQL**
(New Relic Query Language)

NRQL is like SQL but for monitoring data.

Example:

```
SELECT average(cpuPercent) FROM SystemSample
```

This gives a CPU graph.

Example:

```
SELECT average(memoryUsedBytes/memoryTotalBytes)*100 FROM SystemSample
```

This gives a Memory % graph.

---

# 🎯 **BEGINNER TIP**

You don’t need to write NRQL manually right now.

New Relic provides **built-in templates**.

Example:

* “CPU Utilization”
* “RAM Usage”
* “Disk I/O”
* “Network Throughput”
* “Container Count”

Just click → **Add chart → Use preset**

---

# ✅ **Step 4: Select a Data Source**

When creating a widget, New Relic will ask:

**“Where do you want to get data from?”**

Choose:

* **Infrastructure** → if you want system metrics (CPU, memory, disk)
* **APM** → if you installed Node.js agent later
* **Container** → if you're monitoring Docker containers
* **Logs** → if you enabled log forwarding

Since you installed **New Relic Infrastructure agent**, choose:

👉 **Infrastructure**

---

# ⭐ Example: Building a Real Dashboard

A typical beginner dashboard contains:

---

## **Widget #1 – CPU Usage**

Template: **CPU %**
Or NRQL:

```sql
SELECT average(cpuPercent) FROM SystemSample TIMESERIES
```

---

## **Widget #2 – Memory Usage**

Template: **Memory %**
Or NRQL:

```sql
SELECT average(memoryUsedBytes/memoryTotalBytes)*100 FROM SystemSample TIMESERIES
```

---

## **Widget #3 – Container Count**

Template: **Container Count**
Or NRQL:

```sql
SELECT uniqueCount(containerId) FROM ContainerSample
```

---

## **Widget #4 – Disk Usage**

Template: **Disk Used %**
Or:

```sql
SELECT average(diskUsedPercent) FROM StorageSample
```

---

## **Widget #5 – Network In/Out**

Template: **Incoming Traffic**

```sql
SELECT rate(sum(receiveBytesPerSecond), 1 second) FROM NetworkSample TIMESERIES
```

---

## **Widget #6 – Top Processes by CPU**

Template: **Top Processes**
Or:

```sql
SELECT processDisplayName, average(cpuPercent) 
FROM ProcessSample 
FACET processDisplayName 
LIMIT 5
```

---

# 🎯 **Step 5: Rearrange Layout**

Drag charts around and arrange them like a real dashboard.

Usually:

Top row → CPU + Memory
Middle → Containers + Disk
Bottom → Processes + Network

---

# 🎯 **Step 6: Save the Dashboard**

Click **Save**

Your dashboard is now available in the list.

---

# ⭐ OPTIONAL (but powerful)

### **Add filters**

You can filter by:

* host
* container
* service name
* environment

Example: only show data for:

```
host = "ip-10-0-0-12"
```

---

# ⭐ OPTIONAL: Auto-refresh

Enable auto-refresh:

* every 30 seconds
* every 1 minute

This makes the dashboard real-time.

---

# 🎉 **That’s it — You created your first real monitoring dashboard**

This is EXACTLY what DevOps/SRE engineers do every day.