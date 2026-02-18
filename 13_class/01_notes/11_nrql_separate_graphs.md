If you just want to show **multiple metrics on the same chart**, using a comma `,` is enough.

Example:

```sql
SELECT average(cpuPercent), average(memoryUsedPercent)
FROM SystemSample
TIMESERIES
```

That will show:

* One line for CPU
* One line for Memory
* In the same graph

---

### 🧠 When comma is enough

Use comma when:

* Same dataset (`FROM` is same)
* Same time range
* Same filtering
* Just different aggregations

---

### 🧠 When comma is NOT enough

You need `FACET` or `FILTER()` when:

* Comparing different apps
* Comparing specific conditions
* Splitting by hostname/service

Example where comma won’t work properly:

```sql
SELECT count(*) 
FROM Transaction 
WHERE appName = 'backend'
```

To compare backend vs frontend, you need:

```sql
SELECT 
  filter(count(*), WHERE appName = 'backend'),
  filter(count(*), WHERE appName = 'frontend')
FROM Transaction
TIMESERIES
```

---

### 🔥 Simple Rule

* Compare metrics → use `,`
* Compare categories → use `FACET`
* Compare custom conditions → use `FILTER()`


---
---
---
---


# 🔵 1️⃣ FACET

### 👉 What it does:

It **splits one metric into multiple lines based on an attribute**.

Think of it like:

> “Break this data by this field”

---

### Example:

```sql
SELECT count(*) 
FROM Transaction 
FACET appName 
TIMESERIES
```

If you have:

* backend
* frontend
* auth-service

You’ll get 3 lines in one chart.

Each line = one `appName`.

---

### 🧠 Real meaning

FACET = **Group By**

It’s basically SQL’s `GROUP BY`.

So:

```sql
FACET hostname
```

Means:

> Show separate line per hostname.

---

# 🔵 2️⃣ FILTER()

### 👉 What it does:

It lets you manually define separate conditions in the same query.

Think of it like:

> “Create custom buckets”

---

### Example:

```sql
SELECT 
  filter(count(*), WHERE appName = 'backend'),
  filter(count(*), WHERE appName = 'frontend')
FROM Transaction
TIMESERIES
```

Now you get:

* 1 line for backend
* 1 line for frontend

Even without FACET.

---

# 🔥 Difference Between FACET and FILTER

| FACET                             | FILTER()                       |
| --------------------------------- | ------------------------------ |
| Automatically splits by attribute | You manually define conditions |
| Dynamic (new values auto-appear)  | Static (only what you write)   |
| Like GROUP BY                     | Like custom IF condition       |

---

# 🧠 Simple Visual Understanding

Imagine this data:

| appName  | errors |
| -------- | ------ |
| backend  | 10     |
| frontend | 5      |

---

### With FACET:

```sql
SELECT sum(errors) FROM Transaction FACET appName
```

→ Automatically shows backend + frontend.

---

### With FILTER:

```sql
SELECT 
  filter(sum(errors), WHERE appName = 'backend'),
  filter(sum(errors), WHERE appName = 'frontend')
FROM Transaction
```

→ Manually separates them.

---

# 🚀 When Should You Use What?

Use **FACET** when:

* You want automatic splitting
* You don’t know all values in advance
* You want per-host, per-app, per-container

Use **FILTER()** when:

* You want to compare specific things
* You want full control
* You don’t want random extra lines

---

# ⚡ In Your DevOps Context

If you’re monitoring:

* Multiple EC2 instances → use `FACET hostname`
* Compare prod vs staging → use `FILTER()`
