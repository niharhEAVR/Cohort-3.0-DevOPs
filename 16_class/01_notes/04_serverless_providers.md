# 🌍 Most Famous Serverless Providers

## 1️⃣ AWS Lambda (by Amazon Web Services)

The most mature and widely used.

Used by:

* Startups
* Enterprises
* Large production systems

Works well with:

* API Gateway
* S3
* DynamoDB
* SQS
* EventBridge

Very powerful ecosystem.

---

## 2️⃣ Google Cloud Functions (by Google Cloud Platform)

Similar to Lambda.

Very good if:

* You use Firebase
* You’re in Google ecosystem
* You want tight GCP integration

---

## 3️⃣ Azure Functions (by Microsoft Azure)

Popular in:

* Enterprises
* Microsoft-heavy companies

Works great with:

* .NET
* Office ecosystem
* Enterprise systems

---

## 4️⃣ Cloudflare Workers (by Cloudflare)

Very interesting model.

Runs:

* At the edge
* In global data centers

Extremely fast for:

* APIs
* Authentication
* Edge logic
* Middleware

---

## 5️⃣ Vercel

Very popular among:

* Next.js developers
* Frontend-heavy startups

Automatically turns:

* API routes
* Server actions

Into serverless functions.

---

# 🧠 Now… How Do They Actually Work?

This is the important part.

---

# Step 1 — You Upload Code

Example:

```js
export default async function handler(req, res) {
  return res.json({ message: "Hello" })
}
```

You deploy it.

---

# Step 2 — Platform Packages It

Behind the scenes:

* Your code is wrapped inside a container
* Dependencies are installed
* Runtime (Node, Python, etc.) is attached

It becomes a small isolated execution unit.

---

# Step 3 — Request Comes In

When someone calls your API:

1. Request hits cloud load balancer
2. Provider checks: is a container already warm?
3. If yes → run immediately
4. If not → create new container (cold start)

---

# Step 4 — Execution

Your function runs:

* Memory allocated (128MB–10GB depending on config)
* CPU assigned
* Timer starts

After response:

* Container may stay warm for a while
* Or get destroyed

---

# Step 5 — Auto Scaling

If:

* 1 user → 1 container
* 1000 users → 1000 containers

Scaling happens automatically.

No Auto Scaling Group config needed.

---

# 🔥 What Makes Cloudflare Workers Different?

Traditional providers:

* Run functions inside lightweight containers

Cloudflare Workers:

* Run on V8 isolates (like mini Chrome engines)
* Much faster cold start
* Lower memory footprint

Very good for:

* Edge authentication
* CDN-level logic
* Lightweight APIs

---

# 💰 How They Charge You

Usually based on:

* Number of requests
* Execution time (milliseconds)
* Memory allocated

Example logic:

If function runs:

* 200ms
* 128MB
* 1 million times

You pay only for that compute time.

No idle billing.

---

# 🚨 Limitations (Important for You)

Since you're into backend + DevOps:

1. Cold starts exist (especially AWS Lambda)
2. Limited execution duration
3. Not ideal for:

   * Long-running WebSocket servers
   * Heavy CPU tasks
4. Debugging is harder than EC2

---

# 🏗 For Someone Like You

You’ve:

* Worked with EC2
* Used ASG
* Built scaling logic
* Dealt with Nginx + WebSockets

So you understand traditional infra.

Now serverless becomes:

> Abstraction over that complexity.

But not replacement for everything.

Real world companies use:

* Lambda for APIs
* EC2 for heavy workloads
* Kubernetes for complex systems

Hybrid architecture.