# 🔵 What is an Alert Policy?

Think of a **policy** like a folder or rulebook for alerts.

It decides:

* 📩 Who gets notified
* 🔔 How they get notified (Slack, Email, PagerDuty, etc.)
* 🧩 How alerts are grouped into issues
* 🔄 When issues auto-close

Without a policy → the system doesn't know how to handle the alert.

So every alert condition must belong to a policy.

---

# 🧠 Simple Example

You create:

* CPU alert
* Memory alert
* Error rate alert

You put them inside:

> "Production Backend Policy"

Now all those alerts:

* Notify the same team
* Follow same grouping rules
* Auto-close using same settings

---

# 🔎 Now Let’s Explain Each Field

---

## 1️⃣ Name your alert condition

This is the name of THIS specific alert.

Example:

* "High CPU usage - Backend"
* "Error rate above 5%"

This should clearly describe the problem.

---

## 2️⃣ Connect this condition to a policy

You can choose:

### 🔘 Existing policy

Attach to already created policy.

### 🔘 New policy

Create a new rule group for this alert.

---

## 3️⃣ Policy name

If you choose "New policy", you must give it a name.

Example:

* "Production Alerts"
* "Kubernetes Cluster Alerts"
* "Payment Service Alerts"

---

# 🔔 4️⃣ Group alert events into issues

This is VERY important.

When alert triggers multiple times, should it:

---

### 🔵 One issue per policy (Selected)

All alerts under this policy are grouped into ONE issue at a time.

Good for:

* Avoiding too many notifications
* When multiple signals mean same incident

---

### 🟡 One issue per condition

Each alert condition gets its own issue.

CPU alert → 1 issue
Memory alert → 1 issue

---

### 🔴 One issue per condition and signal

Most detailed (and noisy).

If 3 servers trigger same condition → 3 separate issues.

⚠️ Can create many notifications.

---

## 5️⃣ Correlate and suppress noise

If enabled:
System automatically groups related alerts.

Reduces alert spam.

Very useful in large systems.

---

## 6️⃣ Close open alert events after X days

Auto closes the issue if no more alert data after X days.

You set: `3 days`

Means:
If alert stops happening → issue closes after 3 days.

---

# ✏️ Customize Alert Events

---

## 7️⃣ Title Template

This is what notification title will show.

Example:

```
High CPU on {{hostname}}
```

---

## 8️⃣ Description Template

More detailed message.

Example:

```
CPU usage exceeded 80% for 5 minutes.
Service: {{service.name}}
Host: {{hostname}}
```

---

## 9️⃣ Runbook URL

Link to documentation explaining:

"What to do when this alert fires"

Example:

```
https://internal-wiki/runbooks/high-cpu
```

Very helpful for team members.

---

## 🔘 Enable on save

If ON → alert becomes active immediately.
If OFF → saved but not running.

---

# 🧠 Why Policies Are Needed

Without policy:

* No notification routing
* No grouping logic
* No auto-close behavior
* No noise control

It’s like creating an alarm without telling:

* Who should hear it
* When it should stop
* How to manage repeated alarms

---
---
---
---

Earlier:

* 🔔 You created an alert condition
* 📂 You attached it to a policy

Now:

* 📩 You choose **where notifications should go**

This is called a **Workflow**.

---

# 🧠 What is a Workflow?

A workflow connects:

> Alert → Policy → Notification Channel

When an issue happens, this workflow sends the alert to selected channels.

---

# 🔹 “Create a new workflow”

You give it a name like:

* "Production Critical Alerts"
* "Backend Error Notifications"
* "Dev Team Alerts"

This helps you manage multiple notification setups.

---

# 🔔 Notify Section (Add Channel)

These are different ways your system can send alerts:

---

## 📧 Email

Sends alert to email addresses.

Simple and common.

---

## 💬 Slack

Sends alert message to a Slack channel.

Example:
`#devops-alerts`

---

## 🟣 Microsoft Teams

Sends alert to Teams channel.

---

## 🔗 Webhook

Sends alert data to a custom HTTP endpoint.

Used when:

* You built your own backend
* You want to process alerts programmatically

Since you're into backend/devops, this is powerful for automation.

---

## 📋 Jira

Creates a Jira ticket automatically.

Good for:

* Bug tracking
* Incident tracking

---

## 🔔 PagerDuty

Used for on-call alerting.
Calls / SMS / pushes notification to engineers.

Used in serious production systems.

---

## 🟢 ServiceNow

Creates incident tickets in ServiceNow.

Enterprise IT environments.

---

## ⚡ AWS EventBridge

Sends alert to AWS event system.
You can trigger:

* Lambda
* Step functions
* Other AWS automation

---

## 📱 Mobile Push

Push notification to monitoring app.

---

## 🔄 Workflow Automation

Triggers automated actions based on alert.
Example:

* Restart service
* Scale server
* Trigger script

---

# 🧠 Why This Is Needed

Creating an alert is not enough.

System must know:

* Where to send it
* Who should receive it
* How to respond

Without workflow → alert triggers but no one is notified.

---

# 🧩 Simple Real Example (For You)

If you're monitoring:

* EC2 CPU
* Docker container crashes
* Backend error rate

Best simple setup:

✅ Email
+
✅ Slack (if working with team)

Later for serious production:

✅ PagerDuty (critical)
✅ Jira (auto ticket creation)
