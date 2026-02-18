![](./images/image%20copy.png)

---

## 🔹 1. Data Aggregation (How data is collected)

### ✅ Window duration: `1 minute`

The system looks at data in **1-minute chunks**.

### 🔁 Sliding window (OFF)

If ON → it continuously recalculates using overlapping time windows.
If OFF → it checks every fixed 1-minute block.

### 📡 Streaming method: **Event flow**

Best when data comes regularly (like CPU, requests, logs).

Other options:

* **Event timer** → waits for timer-based signals
* **Cadence** → fixed interval checks

### ⏳ Delay: `2 minutes`

The system waits 2 minutes before evaluating (helps avoid false alarms from delayed data).

---

## 🔹 2. Gap Filling Strategy

### Fill data gaps with: `None`

If data is missing → it does NOT assume anything.

Other options (if chosen):

* Fill with last value
* Fill with 0
* Custom value

---

## 🔹 3. Evaluation Delay (OFF)

If ON → alert waits extra time before evaluating condition.

Useful if logs arrive late.

---

# 🚨 Alert Condition (Right Side)

## Type: **Static threshold**

It uses a fixed number (not AI anomaly detection).

---

### 📢 Alert triggers when:

> Query value is **above 1**
> for at least **5 minutes**

That means:

If your metric stays **greater than 1 continuously for 5 minutes**,
→ 🔴 It opens a **Critical severity alert**.

---

## 🧠 In Simple Words

Your alert says:

> "If this metric goes above 1 and stays there for 5 minutes, raise a CRITICAL alert."