# ⭐ Full Query

```sql
SELECT average(cpuPercent) AS `CPU used %` 
FROM SystemSample 
WHERE (entityGuid = 'NjY*****************************') 
TIMESERIES AUTO 
SINCE 30 minutes ago 
UNTIL now
```

---

# ⭐ What is the purpose of this command?

This NRQL query is used to **draw a CPU usage graph over time** for **one specific host (your VM)** inside New Relic.

It is used to:

* see CPU % usage
* monitor spikes
* check performance history
* build a CPU graph widget in your dashboard
* debug issues like high CPU usage

This is one of the most common queries in DevOps.

---

# ⭐ Break down the command piece-by-piece

---

## ✅ **1. `SELECT average(cpuPercent) AS "CPU used %"`**

This selects the average CPU percentage being used.

* `cpuPercent` → metric collected by the New Relic Infrastructure agent
* `average()` → smooths the CPU values
* `AS "CPU used %"` → renames the column so the chart looks nice

Meaning:

> “Show me the average CPU usage in %.”

---

## ✅ **2. `FROM SystemSample`**

This is the **data source**.

`SystemSample` is a built-in table that stores:

* CPU usage
* memory usage
* disk usage
* network stats
* load average
* host metrics

Every 5 seconds, the New Relic agent sends data into `SystemSample`.

So this tells NRQL:

> “Fetch this data from the host-level system metrics.”

---

## ✅ **3. `WHERE (entityGuid = 'NjY**************')`**

This filters the results to **one specific VM/server**.

Why?

Because if you have:

* 3 servers
* 10 containers
* 1 cluster

Without this filter → your graph will show ALL CPU values mixed together.

`entityGuid` is the unique ID assigned to each host by New Relic.

This line says:

> “Show CPU usage only for this specific VM.”

---

## ✅ **4. `TIMESERIES AUTO`**

This creates a **graph over time** instead of a single number.

* Without TIMESERIES → result is just one value (boring)
* WITH TIMESERIES → it becomes a chart (line graph)

`AUTO` lets New Relic decide the time granularity:

* 5 seconds
* 10 seconds
* 1 minute
  (depending on zoom level and data volume)

Meaning:

> “Plot this CPU usage as a graph over time.”

---

## ✅ **5. `SINCE 30 minutes ago`**

This tells New Relic the time window.

Meaning:

> “Start showing data from 30 minutes ago.”

If you change it:

* `SINCE 1 hour ago`
* `SINCE 24 hours ago`
* `SINCE yesterday`
* `SINCE this week`

All are valid.

---

## ✅ **6. `UNTIL now`**

End time.

Meaning:

> “Show data up to the current moment.”

You can also do:

* `UNTIL 10 minutes ago`
* `UNTIL today`
* `UNTIL 2025-11-20 15:00:00`

---

# ⭐ In simple terms — FULL meaning

**“Show me the average CPU usage (%) of this one specific server, drawn as a graph, from 30 minutes ago until now.”**

This is how engineers monitor CPU spikes.

---

# ⭐ How you can use this command

### ✔ 1. **Add it to a Dashboard**

Create new widget → “Add chart” → “NRQL” → paste this query.

It will show a CPU graph for your VM.

---

### ✔ 2. **Modify the time period**

Examples:

Last 5 minutes:

```sql
SINCE 5 minutes ago
```

Last 24 hours:

```sql
SINCE 24 hours ago
```

Last 7 days:

```sql
SINCE 7 days ago
```

---

### ✔ 3. **Monitor multiple hosts (remove the filter):**

```sql
SELECT average(cpuPercent) 
FROM SystemSample 
TIMESERIES
```

---

### ✔ 4. **Add memories, load, etc.**

Memory:

```sql
SELECT average(memoryUsedPercent) FROM SystemSample TIMESERIES
```

Load avg:

```sql
SELECT average(loadAverageOneMinute) FROM SystemSample TIMESERIES
```

---

### ✔ 5. **Compare two servers**

```sql
FACET entityGuid
```

---

# ⭐ Why your teacher gave this query

Because this is the **most important and most used query** in New Relic Infrastructure.
It teaches you:

* how to filter hosts
* how to read CPU metrics
* how to create timeseries graphs
* how to build your own dashboards
* how to use NRQL properly



---
---
---
---

```sql
SELECT * FROM SystemSample

SELECT average(cpuPercent) AS `CPU used %` FROM SystemSample WHERE (entityGuid = 'NjY*****************************')

SELECT average(cpuPercent) AS `CPU used %` FROM SystemSample WHERE (entityGuid = 'NjY*****************************') TIMESERIES
```

# **what happens** when you run each chunk individually in the NRQL Query Builder (New Relic CLI/console).

---

# ✅ **1. Query:**

```sql
SELECT * FROM SystemSample
```

## ⭐ **What output you'll see**

You will see **raw system metrics** collected from every host the agent is installed on.

Expect a table of rows like:

| cpuPercent | memoryUsedBytes | loadAverageOneMinute | hostname | diskUsedPercent | entityGuid | timestamp |
| ---------- | --------------- | -------------------- | -------- | --------------- | ---------- | --------- |

Each row represents **one data point** that the agent sent (every 5 seconds).

This is the “raw data dump.”

### ✔ You’ll see:

* CPU %
* memory %
* disk %
* load avg
* network stats
* hostnames
* container info
* entityGuid (very important)
* timestamps

### ❌ No graphs

### ✔ Only row-by-row data

This helps you **discover what fields exist** inside `SystemSample`.

---

# ✅ **2. Query:**

```sql
SELECT average(cpuPercent) AS `CPU used %`
FROM SystemSample
WHERE entityGuid = 'NjY*****************************'
```

## ⭐ **What output you'll see**

You will get **one single number**, something like:

| CPU used % |
| ---------- |
| 17.45      |

(Example)

### ✔ Meaning:

* It takes **ALL CPU samples**
* Filters only your **one VM**
* Calculates **average CPU usage over ALL time in the query window**
* Returns a **single value**, not a graph

### ❌ No timeseries → No graph

### ✔ Just a number like `17% CPU`

This is helpful when you want:

* CPU average right now
* CPU over last 5 minutes
* CPU over last 1 hour

The main purpose: **point-in-time metric**.

---

# ✅ **3. Query:**

```sql
SELECT average(cpuPercent) AS `CPU used %`
FROM SystemSample
WHERE entityGuid = 'NjY*****************************'
TIMESERIES
```

## ⭐ **What output you’ll see**

You will now see a **line graph**.

You get:

* timestamps on X-axis
* CPU % on Y-axis
* dots/points connected as a time series graph

Example:

| Time  | CPU used % |
| ----- | ---------- |
| 10:00 | 12%        |
| 10:01 | 15%        |
| 10:02 | 47%        |
| 10:03 | 20%        |

New Relic will determine the interval based on data density (default is ~1 minute or 5 seconds depending on zoom).

### ✔ Purpose:

This shows CPU usage **over time**, not just one number.

### ✔ You can visually SEE spikes

### ✔ Useful for monitoring

### ✔ Useful for dashboards

---

# 🎯 **Summary of What You Get**

| Query                                   | Output                  | Visual? | Purpose                   |
| --------------------------------------- | ----------------------- | ------- | ------------------------- |
| `SELECT * FROM SystemSample`            | Raw system data rows    | No      | Explore available metrics |
| `SELECT average(cpuPercent)`            | One single CPU % number | No      | Point-in-time CPU value   |
| `SELECT average(cpuPercent) TIMESERIES` | CPU graph over time     | Yes     | Monitoring, dashboards    |

---

# ⭐ Which one should you use?

### 👉 For understanding data structure

Use:

```sql
SELECT * FROM SystemSample
```

### 👉 For single value (not a graph)

Use:

```sql
SELECT average(cpuPercent)
```

### 👉 For graphs and dashboards

Use:

```sql
SELECT average(cpuPercent) TIMESERIES
```
