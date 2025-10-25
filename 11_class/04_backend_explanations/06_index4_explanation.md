# There was a bug on our previous code that 

## 🧩 1️⃣ What Happened *Before* (the bug)

In your **previous code**, inside `refreshInstances()`, you had:

```ts
freshMachines.push({
    instanceId: instance.InstanceId,
    dns: instance.PublicDnsName,
    ip: instance.PublicIpAddress,
    isUsed: false
});
```

That means:
👉 Every time you refreshed instances (which happens every 10 seconds),
**you reset `isUsed` to `false` for every single machine.**

---

### ⚠️ Why that’s a Problem

Let’s walk through a real example 👇

| Time | Event                                | What happens internally                                                                |
| ---- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| 0s   | App starts                           | Two EC2 machines are detected, both marked `isUsed: false`.                            |
| 2s   | User A requests `/`                  | Server finds one idle machine → marks it `isUsed = true`.                              |
| 10s  | `setInterval(refreshInstances)` runs | `ALL_MACHINES` is rebuilt — but all entries are created again with `isUsed: false`. 💥 |
| 11s  | User B requests `/`                  | System sees both machines as idle → **assigns the same machine again** to User B! 😱   |

So the **machine that was already in use** appeared **free again** after refresh.
→ Two users could get assigned to the same EC2 instance.

That’s a **critical bug** for load balancing, user isolation, and task management.

---

## 🧩 2️⃣ What the Fix Does (New Version)

Now, in your **updated code**, you added this smart line:

```ts
const oldState = ALL_MACHINES.find(m => m.instanceId === instance.InstanceId);
isUsed: oldState ? oldState.isUsed : false
```

👉 This means:

* Before overwriting `ALL_MACHINES`, you **check** if that instance existed in the previous list.
* If it did, you **carry forward its `isUsed` flag**.
* Only new machines (freshly launched by AWS) start with `isUsed: false`.

---

### ✅ Now the same example looks like this:

| Time | Event                   | Result                                                                 |
| ---- | ----------------------- | ---------------------------------------------------------------------- |
| 0s   | App starts              | Two machines detected → both `isUsed: false`                           |
| 2s   | User A requests `/`     | One machine marked `isUsed = true`                                     |
| 10s  | refreshInstances() runs | The function checks old state — keeps `isUsed = true` for that machine |
| 11s  | User B requests `/`     | Server correctly skips used machine and gives the other idle one ✅     |

No duplicate assignment.
No conflicts.
No loss of machine state after auto-refresh.

---

## 🧩 3️⃣ Why It Was Hard to Catch

The tricky part was:

* The bug **only appeared after a refresh**,
* Refresh happened automatically every **10 seconds**,
* So at first, everything looked fine, but after 10 seconds, your app started reassigning already-used machines.

---

## 🧩 4️⃣ In Short (Summary Table)

| Problem Before Fix                        | What Caused It                     | Fix Applied                                       | Result                                        |
| ----------------------------------------- | ---------------------------------- | ------------------------------------------------- | --------------------------------------------- |
| Machines got reassigned to multiple users | Every refresh set `isUsed = false` | Preserve old `isUsed` using previous state lookup | Machines keep their used/free state correctly |

---

Let’s now go **line-by-line**, to understand **how the backend orchestrates EC2 Auto Scaling, manages available instances, and serves users.**

---

# 🧠 OVERVIEW

This backend:

* Keeps a **list of all EC2 instances** from the Auto Scaling Group (`ALL_MACHINES`).
* Periodically refreshes their state.
* Assigns **idle** machines to users.
* Automatically **scales up** if none are idle.
* Can **terminate (scale down)** machines when not needed.

---

## 🧩 1️⃣ refreshInstances() — Core Sync Function

```ts
async function refreshInstances() {
```

👉 Defines the main function that syncs your internal state with AWS.

---

### 🔹 Step 1 — Get ASG instance data

```ts
    let asgData = await client.send(
        new DescribeAutoScalingInstancesCommand()
    );

    let instanceIds = asgData.AutoScalingInstances?.map(x => x.InstanceId) || [];
```

👉 Fetches all instances under your Auto Scaling Group (ASG)
and extracts their instance IDs.

---

### 🔹 Step 2 — Handle Case: No Instances Exist

```ts
    if (instanceIds.length === 0) {
        console.log("No instances found in ASG.");
        await machineUpInitial();
        console.log("Two instances Started in ASG.");
```

👉 If there are **no running instances**, it triggers:

* `machineUpInitial()` → sets desired capacity = 2.

---

### 🔹 Step 3 — Wait Until Ready

```ts
        await waitForInstancesToBeFullyReady();
        console.log("Instances are now running. Continuing...");

        asgData = await client.send(
            new DescribeAutoScalingInstancesCommand()
        );
        instanceIds = asgData.AutoScalingInstances?.map(x => x.InstanceId) || [];
    }
```

👉 Waits for EC2s to fully start (DNS + IP assigned).
Then fetches fresh ASG data again.

---

### 🔹 Step 4 — Describe EC2 Instances

```ts
    const ec2Response = await ec2Client.send(
        new DescribeInstancesCommand({ InstanceIds: instanceIds })
    );
```

👉 Now you pull **full instance details** (state, IP, DNS, etc.) from EC2 API.

---

### 🔹 Step 5 — Build Updated Machine List

```ts
    const freshMachines: Machine[] = [];

    ec2Response.Reservations?.forEach(reservation => {
        reservation.Instances?.forEach(instance => {
            const oldState = ALL_MACHINES.find(m => m.instanceId === instance.InstanceId);
```

👉 For each EC2 instance:

* You check if it already existed in `ALL_MACHINES` (so you can preserve `isUsed`).

---

### 🔹 Step 6 — Keep or Reset Usage Flag

```ts
            freshMachines.push({
                instanceId: instance.InstanceId!,
                dns: instance.PublicDnsName!,
                ip: instance.PublicIpAddress!,
                isUsed: oldState ? oldState.isUsed : false
            });
```

👉 This line fixes the earlier bug ✅
If the instance existed before, it keeps its previous `isUsed` value.
If it’s a brand-new machine, it defaults to `false`.

---

### 🔹 Step 7 — Replace Old Global List

```ts
    ALL_MACHINES.length = 0;
    ALL_MACHINES.push(...freshMachines);

    console.log("UPDATED MACHINES:", ALL_MACHINES);
}
```

👉 Clears the old list and replaces it with the latest data — ensuring `ALL_MACHINES` always reflects AWS reality.

---

## 🧩 2️⃣ Auto Refresh Loop

```ts
await refreshInstances();
setInterval(async () => {
    await refreshInstances();
}, 10 * 1000);
```

👉 Runs once on startup (so the app starts with updated machines)
Then, **every 10 seconds**, it re-syncs data with AWS.

---

## 🧩 3️⃣ Scaling Parameters

```ts
const MAX_ALLOWED_MACHINES = 20;
```

👉 The system will never create more than 20 EC2 instances total.

---

## 🧩 4️⃣ scaleUp() — Increase Capacity When Needed

```ts
async function scaleUp() {
    const idleCount = ALL_MACHINES.filter(x => x.isUsed === false).length;
    let desired = ALL_MACHINES.length + (5 - idleCount);
```

👉 Counts **idle** machines.
You want to **always keep at least 5 idle machines ready**.
So, if idle count < 5 → increase ASG’s desired capacity.

Example:

* Current total = 10
* Idle = 2
  → Need 3 more → desired = 13

---

### Limit Protection

```ts
    if (desired > MAX_ALLOWED_MACHINES) {
        desired = MAX_ALLOWED_MACHINES;
    }
```

👉 Prevents over-scaling beyond 20.

---

### Send Scaling Command

```ts
    return await client.send(new SetDesiredCapacityCommand({
        AutoScalingGroupName: "bolt-asg",
        DesiredCapacity: desired
    }));
}
```

👉 Updates ASG’s target instance count on AWS.

---

## 🧩 5️⃣ scaleDown() — Remove a Machine

```ts
async function scaleDown(machineId: string) {
    const command = new TerminateInstanceInAutoScalingGroupCommand({
        InstanceId: machineId,
        ShouldDecrementDesiredCapacity: true
    })
    return await client.send(command);
}
```

👉 Terminates a specific EC2 instance **safely inside ASG**,
and decreases ASG’s desired capacity (so it doesn’t launch a new one automatically).

---

## 🧩 6️⃣ Express Route — `/` (Assign Machine)

```ts
app.get("/", async (req, res) => {
    const idleMachine = ALL_MACHINES.find(x => x.isUsed === false);
```

👉 When a user requests `/`, the app tries to find **one unused machine**.

---

### Case A: No Idle Machines

```ts
    if (!idleMachine) {
        console.log("⚠ No idle machines — scaling up...");
        await scaleUp();  
        return res.status(404).send("No idle machines — scaling up now, retry after a few seconds.");
    }
```

👉 If all are busy:

* Log a warning.
* Trigger `scaleUp()` to launch new EC2s.
* Return HTTP 404 so the client knows to retry later.

---

### Case B: Idle Machine Found

```ts
    idleMachine.isUsed = true;
    
    scaleUp(); // fire-and-forget → keep extra idle machines ready
```

👉 Marks this instance as **assigned** to a user (so others can’t take it).
Then calls `scaleUp()` again — **proactively keeps 5 idle machines** always ready.
(Non-blocking — it doesn’t `await` this one.)

---

### Send Machine Info to User

```ts
    return res.status(200).json({
        machineId: idleMachine.instanceId,
        dns: idleMachine.dns,
        ip: idleMachine.ip,
        comment: "Machine is ready — connect on :8080 now."
    });
});
```

👉 Returns that machine’s details so the frontend/user can connect to it directly (e.g. via SSH or HTTP).

---

## 🧩 7️⃣ Express Route — `/destroy/:id` (Terminate Machine)

```ts
app.get("/destroy/:id", async (req, res) => {
    const machineId: string = req.params.id;

    await scaleDown(machineId);

    return res.json({ message: `Terminated ${machineId} and scaled down.` });
});
```

👉 Lets you manually terminate a machine by ID:

* Sends `TerminateInstanceInAutoScalingGroupCommand`.
* Decreases capacity by 1.
* Responds with a success message.

---

## 🧩 8️⃣ Start the Express Server

```ts
app.listen(3000);
```

👉 Starts the web server at **port 3000** so users can send requests to:

* `/` → get idle machine
* `/destroy/:id` → terminate a machine

---

# ⚙️ FULL FLOW SUMMARY (Plain English)

| Step | Description                                                    |
| ---- | -------------------------------------------------------------- |
| 1️⃣  | App starts → `refreshInstances()` runs → loads machine list    |
| 2️⃣  | Every 10 seconds → it refreshes from AWS                       |
| 3️⃣  | When a user visits `/` → system finds an idle EC2              |
| 4️⃣  | If found → marks as `isUsed = true` and gives it to the user   |
| 5️⃣  | If none idle → scales up ASG to create new EC2s                |
| 6️⃣  | The backend automatically maintains **at least 5 idle** EC2s   |
| 7️⃣  | You can manually kill one via `/destroy/:id`                   |
| 8️⃣  | The system ensures there are never more than 20 machines total |

---

## 🧩 Bonus — Fix You Added (`isUsed` retention)

The **main improvement** from your previous version:

```ts
const oldState = ALL_MACHINES.find(m => m.instanceId === instance.InstanceId);
isUsed: oldState ? oldState.isUsed : false
```

✅ This keeps machine usage state even after refreshing —
so a user doesn’t get reassigned a machine that’s already in use.