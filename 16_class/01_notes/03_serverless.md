# 🚀 What Is Serverless?

**Serverless does NOT mean there are no servers.**

It means:

> You don’t manage the servers.

The cloud provider manages:

* Infrastructure
* Scaling
* Load balancing
* Failures
* Capacity planning

You only write **code**.

---

# 🧠 Traditional Backend vs Serverless

### 🏠 Traditional (EC2 / VM)

You:

* Rent a VM
* Install Node
* Run `node index.js`
* Configure scaling
* Monitor health
* Pay 24/7

Even if nobody visits your app, the server is running.

---

### ⚡ Serverless

You:

* Upload a function
* Cloud runs it only when a request comes
* Automatically scales
* Charges per request

If no traffic → **no cost**

---

# 🔎 Real Example

Instead of this:

```js
app.get("/api/user", (req, res) => {
  res.json({ name: "Nihar" })
})
```

Running on an always-on server…

In serverless you write:

```js
export default function handler(req, res) {
  res.status(200).json({ name: "Nihar" })
}
```

And deploy it to:

* AWS Lambda
* Vercel
* Google Cloud Functions
* Cloudflare Workers

Now:

1. Request comes
2. Platform spins up execution environment
3. Runs your function
4. Returns response
5. Shuts it down

You never see the server.

---

# ⚙️ How It Actually Works Internally

Behind the scenes:

* Your function runs inside a container
* That container is created when needed
* If traffic increases → more containers created
* If traffic drops → containers destroyed

Fully automatic scaling.

---

# 💰 Pricing Model

Traditional:

* Pay per hour (even idle)

Serverless:

* Pay per:

  * Execution time
  * Number of requests
  * Memory usage

For small projects → very cheap.

---

# 📦 Types of Serverless

There are two main types:

## 1️⃣ FaaS (Function as a Service)

Example:

* AWS Lambda

You deploy small functions.

Good for:

* APIs
* Webhooks
* Background jobs

---

## 2️⃣ Serverless Platforms (Full App Deployment)

Example:

* Vercel

You push your repo.
It:

* Builds your app
* Deploys APIs as functions
* Handles CDN
* Auto scales everything

Perfect for Next.js apps (which you’ve been learning).

---

# ❌ Downsides of Serverless

Important for interviews and real projects.

### 1. Cold Starts

If function hasn’t run recently:

* It takes 100ms–1s extra to start

### 2. Limited Execution Time

Example:

* Lambda max execution time ~15 minutes

Not good for:

* Long-running processes
* Heavy CPU jobs

### 3. Less Control

You can’t SSH into the server.
You don’t control OS-level configs.

---

# 🔥 When Should YOU Use It?

Since you're into:

* Full stack
* DevOps
* Building SaaS-like tools

Use serverless when:

✅ Building APIs
✅ MVP projects
✅ Hackathons
✅ Portfolio apps
✅ Low-to-medium traffic SaaS

Avoid when:

❌ Real-time heavy WebSockets (like your drawing app)
❌ Long-running processes
❌ Heavy compute workloads

---

# 🧠 Simple Analogy

Traditional server:

> You buy a car and maintain it.

Serverless:

> You book Uber only when you need to travel.

No maintenance. No idle cost.

---

# 🎯 For You Specifically

Since you already:

* Built EC2 auto scaling logic
* Used Docker compose
* Handled load balancers

You now understand both worlds.

That’s actually powerful.

Most devs only know one.
