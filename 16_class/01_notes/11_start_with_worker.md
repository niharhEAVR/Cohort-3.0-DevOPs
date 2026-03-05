# 🚀 How To Start With Cloudflare Workers

# 🛠 Method 1 (Fastest – Dashboard Way)

This is best for first time.

### Step 1

Create a free Cloudflare account.

### Step 2

Go to **Workers & Pages**.

### Step 3

Click **Create Worker**.

You’ll see an online code editor.

### Step 4

Replace code with:

```js
export default {
  async fetch(request) {
    return new Response("Hello Nihar 👋 This is your first Worker!");
  }
}
```

### Step 5

Click **Deploy**.

Boom 💥
You’ll get a URL like:

```
your-name.workers.dev
```

Open it → your function runs globally.

No server.
No port.
No EC2.

---

# 💻 Method 2 (Professional Way – Using CLI)

Since you’re a serious dev, you’ll prefer this.

Install Wrangler (Cloudflare CLI):

```bash
npm create cloudflare@latest
```

It will ask:

* Project name
* Template type
* Deploy? (yes)

Then:

```bash
cd your-project
npm run deploy
```

That’s it.

---

# 🧠 What Actually Happens?

When request comes:

```
User → Cloudflare Edge → Your Worker executes → Response sent
```

Cloudflare handles:

* Scaling
* Infrastructure
* Global routing

You just write code.

---

# ⚡ Example: Mini API

```js
export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === "/api") {
      return Response.json({ message: "API working 🚀" })
    }

    return new Response("Not Found", { status: 404 })
  }
}
```

Now you built an API without Express.

---

# 🧩 Can You Use Database?

Yes:

* Cloudflare KV (key-value store)
* Durable Objects
* D1 (SQLite-based DB)
* Or call your existing EC2 backend

Workers can act as:

* API gateway
* Middleware layer
* Authentication filter
* Rate limiter

Very powerful combo with your current infra.

---

# 🆚 Should You Replace EC2?

Not immediately.

For you:

Best combo:

* Heavy backend → EC2
* Lightweight edge logic → Worker

That’s production-grade architecture.

---

# 🎯 Simple Starting Plan For You

1. Create one Worker
2. Build a small API endpoint
3. Try calling it from frontend
4. Then try adding authentication logic
5. Then connect to a simple KV storage

Step-by-step growth.



---
---
---
---
---
---




# 🧠 What That Code Means

You selected **Hello World**, and Cloudflare generated this:

```js
export default {
  async fetch(request, env, ctx) {
    console.info({ message: 'Hello World Worker received a request' });
    return new Response('Hello World!');
  },
};
```

This is the Worker equivalent of:

```js
app.get("/", (req, res) => {
  res.send("Hello World");
});
```

But instead of Express…

Cloudflare automatically calls the `fetch()` function **every time a request comes**.

---

# 🔥 What Is `fetch(request, env, ctx)`?

This is the main handler.

Whenever someone visits:

```
yourname.workers.dev
```

Cloudflare does:

```
Call fetch() → Run your code → Send response
```

---

### 🧾 Parameters Explained

* `request` → Incoming HTTP request (like req in Express)
* `env` → Environment variables (like process.env)
* `ctx` → Background tasks control (advanced usage)

For now, ignore `env` and `ctx`.

---

# 🚀 What You Should Do Now

Just click:

👉 **Deploy**

After deploying:

Cloudflare will give you a URL like:

```
https://your-worker-name.your-subdomain.workers.dev
```

Open it.

You will see:

```
Hello World!
```

And boom — your code is running globally 🌍

No server.
No EC2.
No port 3000.

---

# 🧠 Why This Is Powerful

With this tiny function:

* Cloudflare handles scaling
* Runs near users
* No server cost running idle
* No Docker needed

This is serverless in action.

---

# 🎯 Now Let’s Upgrade It (Try This)

Replace the code with:

```js
export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api") {
      return Response.json({ message: "API is working 🚀" });
    }

    return new Response("Welcome to Nihar's Worker 😎");
  },
};
```

Deploy again.

Now try visiting:

```
/api
```

You just built a mini API.

You’re officially running edge serverless code now 😄

Feels different from EC2, right?