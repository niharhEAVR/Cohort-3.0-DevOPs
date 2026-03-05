**Wrangler** is the **official CLI (command line tool)** used to **develop, test, and deploy Cloudflare Workers**.

Think of it as the **tool that connects your local code to Cloudflare’s infrastructure**.

A simple mental model:

```
Your code (on your laptop)
        ↓
     Wrangler
        ↓
Cloudflare Edge Network
```

So Wrangler is basically the **bridge between your computer and Cloudflare**.

---

# What Wrangler actually does

Wrangler helps you do 5 main things.

## 1. Create a Worker project

When you ran something like:

```bash
npm create cloudflare@latest
```

Wrangler generated your project structure.

Example project:

```
my-worker/
 ├─ src/
 │   └─ index.ts
 ├─ wrangler.toml
 ├─ package.json
 └─ node_modules
```

Wrangler sets up everything needed for Cloudflare Workers.

---

# 2. Run your Worker locally

Instead of deploying every time, you can test locally.

Command:

```bash
npx wrangler dev
```

Wrangler will start a **local development server**.

Example output:

```
http://localhost:8787
```

When you open that URL, your worker runs locally.

So the flow becomes:

```
Browser → Wrangler local server → Worker code
```

This is similar to running:

```
node server.js
```

in Express.

---

# 3. Deploy your Worker

Wrangler is what **uploads your code to Cloudflare**.

Command:

```bash
npx wrangler deploy
```

Wrangler will:

1. bundle your code
2. upload it to Cloudflare
3. deploy it to the edge network

Then your worker becomes accessible globally:

```
https://your-worker.username.workers.dev
```

---

# 4. Manage environment variables

Wrangler reads the **configuration file**:

```
wrangler.toml
```

Example:

```toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
API_KEY = "12345"
```

Then inside your worker:

```ts
env.API_KEY
```

Wrangler handles injecting those values during deployment.

---

# 5. Bind Cloudflare services

Wrangler connects your worker with Cloudflare services like:

* KV
* D1 database
* R2 storage
* Durable Objects

Example in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "MY_KV"
id = "abc123"
```

Now inside your worker:

```ts
env.MY_KV.get("key")
```

Wrangler creates this connection.

---

# Why Wrangler is needed

Cloudflare Workers run on **Cloudflare Edge servers**, not on your computer.

So something must:

* package your code
* upload it
* configure it
* connect services

That tool is **Wrangler**.

Without Wrangler, deploying Workers would be very complicated.

---

# Simple analogy

Think of Wrangler like **Git for Cloudflare Workers**.

```
Git → pushes code to GitHub
Wrangler → pushes code to Cloudflare
```

---

# Common Wrangler commands

### Start local development

```bash
wrangler dev
```

### Deploy worker

```bash
wrangler deploy
```

### View logs

```bash
wrangler tail
```

### Create project

```bash
npm create cloudflare@latest
```

---

# Important concept (most beginners miss this)

Wrangler also acts as a **bundler**.

When you deploy:

```
wrangler deploy
```

Wrangler automatically:

* bundles TypeScript
* resolves imports
* optimizes code
* uploads the final bundle

So you don't need Webpack or Vite for Workers.
