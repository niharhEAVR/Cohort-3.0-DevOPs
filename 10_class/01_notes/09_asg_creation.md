## 🧩 What is an **ASG (Auto Scaling Group)** in AWS?

**ASG = Auto Scaling Group**
It’s an AWS service that **automatically manages a group of EC2 instances** for you —
it can **launch**, **stop**, or **terminate** instances based on demand, health, or schedules.

---

### ⚙️ In simple words:

> An ASG keeps your app running with the **right number of EC2 instances** — not too many (to save cost), and not too few (to handle traffic).

---

### 🧠 Example

Let’s say you run a web app and want:

* **Minimum 2 EC2 instances**
* **Maximum 5 EC2 instances**
* Target CPU usage: **50%**

Then the ASG will:

* Start with 2 instances.
* If traffic grows and CPU > 50%, it’ll **add** more EC2s (scale out).
* If traffic drops and CPU < 50%, it’ll **terminate** some (scale in).
* If any instance crashes, it’ll **replace** it automatically.

So your app stays available — **without you manually starting or stopping EC2s.**

---

### 🔗 ASG + Target Group + Load Balancer

These three often work together:

1. **Load Balancer (ALB/NLB)** → routes user traffic
2. **Target Group** → connects the Load Balancer to EC2s
3. **Auto Scaling Group (ASG)** → automatically creates/removes EC2s and registers them to the Target Group

So:

```
User → Load Balancer → Target Group → Auto Scaling Group → EC2 Instances
```

---

### 🧾 Key Components of an ASG

| Component                           | Description                                                            |
| ----------------------------------- | ---------------------------------------------------------------------- |
| **Launch Template / Launch Config** | Blueprint for new instances (AMI, instance type, security group, etc.) |
| **Desired Capacity**                | How many instances you want running by default                         |
| **Min / Max Size**                  | Lower and upper limits for auto-scaling                                |
| **Scaling Policies**                | Rules that tell AWS when to add/remove instances (e.g., CPU > 70%)     |
| **Health Checks**                   | Replaces unhealthy instances automatically                             |
| **Target Group Attachment**         | Ensures all instances are registered behind your Load Balancer         |

---

### 🧠 TL;DR

| Feature                          | What It Does                                    |
| -------------------------------- | ----------------------------------------------- |
| **ASG (Auto Scaling Group)**     | Keeps the right number of EC2 instances running |
| **Automatically scales**         | Adds or removes EC2s based on demand            |
| **Self-healing**                 | Replaces failed instances                       |
| **Integrates with Target Group** | So traffic routing happens automatically        |

---
---
---
---

# 🚀 Goal

You want to:
1. ✅ Create an Auto Scaling Group (ASG)
2. ✅ Create a brand new **Load Balancer (ALB)** while setting up the ASG
3. ✅ Automatically attach instances and serve traffic
4. ✅ Use your **existing Image, Launch Template, and Target Group**

---

# 🛠 Step-by-Step: Create ASG with a New Load Balancer

Go to:

**EC2 Dashboard → Auto Scaling Groups → Create Auto Scaling group**

---

## 🧩 STEP 1: Basic Configuration

- **Auto Scaling group name**: e.g., `asg-bun-app`
- **Launch template**: Choose the one you already created
  - You’ll see a dropdown → select your Launch Template and version (default/latest)

---

## 🧩 STEP 2: Choose Network and Subnets

This defines **where your EC2s will run**.

- **VPC**: Choose your default or custom VPC
- **Subnets**: Select at least **two subnets in different Availability Zones**
  - e.g., `subnet-a (us-east-1a)` and `subnet-b (us-east-1b)`
  - ✅ This gives high availability across multiple AZs

---

## 🧩 STEP 3: Attach to a Load Balancer

Now here’s where you create a new Load Balancer **from scratch**.

You’ll see:

### ✅ [✔] Attach to a new load balancer

### 1. **Load Balancer Name**  
Choose something like `bun-lb`

### 2. **Load Balancer Type**
Choose: `Application Load Balancer (HTTP/HTTPS based)`  
_(It’s smart and routes based on path, host, etc.)_

### 3. **Scheme**  
- **Internet-facing**: Public website (external users access it)
- **Internal**: For internal services only (within VPC)

> For a public site, pick **Internet-facing**.

---

### 4. **Listener Configuration**

Here, a **listener** defines what port your load balancer listens to and where to send the traffic.

You'll see:
- **Protocol**: HTTP
- **Port**: 80 (default web port)

From load balancer it will send the traffic to 3000 port of the app but load balancer will listen users from port 80

---

### 5. **Target Group Configuration**

Since you already have a Target Group:

- **Target Group name**: Use the one you created earlier.
- **Target type**: `instance`
- **Protocol**: HTTP
- **Port**: 3000 (or whatever your app uses)

### 🔁 Health checks

- Path: `/health`  
(Your app should respond to this path to let AWS know it's healthy)

---

## 🧩 STEP 4: Health Checks

Choose:  
✅ **ELB health check**

Why?

Because your Load Balancer already performs health checks on the EC2 instances through the Target Group. So the ASG should respect the same checks.

---

## 🧩 STEP 5: Group Size

Here you tell ASG how many EC2s to run.

| Field        | Meaning |
|--------------|---------|
| **Desired**  | How many EC2s to launch at the start (e.g., 1) |
| **Minimum**  | The least number of EC2s that should always be running |
| **Maximum**  | The max number of EC2s you allow during high traffic |

✍️ Example:
- Desired = 1
- Min = 1
- Max = 3

---

## 🧩 STEP 6: Scaling Policies

Choose: ✅ **Target tracking scaling policy**

This lets AWS automatically add or remove EC2s based on some metric.

### Metric type:
- `Average CPU utilization`

### Target value:
- e.g., `50`

> This means: If average CPU goes above 50%, AWS will create more EC2s. If it's lower, it will terminate extra ones.

---

## 🧩 STEP 7: Notifications (Optional)

You can skip this. It’s for email or SNS alerts when things scale up or down.

---

## 🧩 STEP 8: Tags (Optional)

You can add tags to track your resources. e.g.,

| Key         | Value       |
|-------------|-------------|
| Project     | bun-app     |
| Environment | production  |

---

## 🧩 STEP 9: Review and Create

Double check:
- ✅ Load Balancer and Target Group look correct
- ✅ Launch Template points to your image
- ✅ Scaling policy is reasonable
- ✅ Subnets are spread across zones

Click: **Create Auto Scaling Group**

---

## ✅ What Happens Now?

Once created:

- Your **Load Balancer** is live
- The **Target Group** is listening for health on `/health`
- Your **ASG** launches one EC2 (or more)
- The EC2 gets:
  - Auto-registered to the Target Group
  - Health-checked via the `/health` endpoint
  - Traffic routed by the Load Balancer

---

## 🧠 Deep Summary of Every Component

| Component        | Purpose |
|------------------|---------|
| **Launch Template** | Reusable config for launching EC2s |
| **Image (AMI)**      | Pre-installed system and app |
| **Auto Scaling Group** | Creates/destroys EC2s automatically |
| **Target Group** | Group of instances your LB routes traffic to |
| **Load Balancer (ALB)** | Distributes traffic to healthy EC2s |
| **Health Check (`/health`)** | Checks if your app is working or not |

---
---
---

When you're now moving into **managing updates** in production-like environments. Let's walk through this in **very clear steps**, starting from updating your Launch Template to restarting the desired instances from scratch in the Auto Scaling Group (ASG).

---

## 🎯 Goal Recap

You want to:
1. ✅ Make a change to your **Launch Template**
2. ✅ Use the new **Launch Template Version** in your ASG
3. ✅ Stop all current EC2 instances managed by ASG
4. ✅ Restart them cleanly using the **new version** of the Launch Template

---

## 🛠️ STEP 1: Edit or Create a New Launch Template Version

> You cannot "edit" an existing version — AWS keeps versions immutable.  
> So you'll **create a new version** of your existing Launch Template.

### ✅ To do this:
1. Go to **EC2 → Launch Templates**
2. Select your launch template (e.g., `bun-launch-template`)
3. Click on **Actions → Modify template (Create new version)**
4. Make your changes:
   - User data script (e.g., updated Bun path or app logic)
   - AMI, instance type, key pair, etc.
5. Click **Create new version**

---

## 🧩 STEP 2: Update Auto Scaling Group to Use the New Version

1. Go to **EC2 → Auto Scaling Groups**
2. Select your ASG (e.g., `asg-bun-app`)
3. Click **Edit**
4. Scroll to **Launch Template**
   - You’ll see:
     ```
     Launch template name: bun-launch-template
     Launch template version: 1 (or “default”)
     ```
5. Change the version:
   - Select the version number you just created
   - Or set the version to **Latest** (so ASG always uses the most recent)

6. Click **Update**

---

## 💣 STEP 3: Replace All Existing Instances (Rolling Restart)

Now, your ASG knows about the new version, but the current EC2s are still running the **old version**.

You have **2 options** to recreate the instances:

---

### ✅ OPTION 1: Manual Refresh

1. Set **Desired capacity = 0** to terminate all instances:
   - Go to your ASG
   - Click **Edit**
   - Set `Desired capacity = 0`, `Min = 0`, `Max = same`
   - Save → all EC2s will be terminated
2. Wait for 1–2 minutes
3. Then set `Desired = 1` (or your original number) again
   - New instances will launch using the new template version

---

### ✅ OPTION 2: Instance Refresh (Safer)

This is more graceful and **recommended in production**.

1. Go to your ASG
2. Click **Instance refresh → Start instance refresh**
3. Choose:
   - **Minimum healthy percentage**: e.g., 0% (terminate all at once), or 50% for rolling
   - **Warm-up time**: e.g., 300s (optional)
4. Click **Start**

> This will gradually terminate and replace your EC2s with new ones using the new template.

---

## ✅ Summary

| Task | Action |
|------|--------|
| Modify Launch Template | Create **new version**, not edit |
| Apply new version to ASG | Edit ASG → Change template version |
| Restart all instances | Set Desired = 0 then back up again **or** use **Instance Refresh** |

---

## 🔁 Pro Tip

If you're actively testing a lot and want ASG to always use the latest template version:

- In the ASG config, set **Launch Template Version** to `Latest` instead of a specific number.
- This way, any time you create a new template version, ASG can use it without editing ASG config again.
