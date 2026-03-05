# Serverless with Cloudflare Workers – Class Notes

## 📚 Today's Class Slides

Slide Link:
https://projects.100xdevs.com/tracks/eooSv7lnuwBO6wl9YA5w/serverless-1

---

# 🚀 What We Did in Today's Class

## 1. Cloudflare Setup

* Logged into the Cloudflare dashboard
* Created our **first Cloudflare Worker**
* Built a simple **Hello World Worker**

After deploying, we received a **Cloudflare Worker URL** and visited it in the browser.

---

## 2. Creating a Cloudflare Worker Project

We initialized a Worker project using:

```sh
npm create cloudflare@latest -- my-first-worker
```

### Important CLI Commands

```sh
npx wrangler login
```

Logs into your Cloudflare account from the CLI.

```sh
npx wrangler deploy
```

Deploys your worker to Cloudflare.

👉 **Wrangler** acts as the **middleman** between your local project and Cloudflare's infrastructure.

---

## 3. Understanding the Worker Code

After creating the project we:

* Examined the default Worker code
* Modified some parts of the code
* Deployed the updated version using Wrangler

Official documentation used:
https://developers.cloudflare.com/workers/get-started/guide/

---

# ⚡ Using Frameworks with Workers

Writing raw Worker code can be inconvenient.

To structure the app like **Express**, we can use frameworks.

One popular framework for Workers is:

**Hono**

Official docs:
https://hono.dev/docs/getting-started/basic

---

# 🧩 Creating a Hono Project

We initialized a Hono project:

```sh
npm create hono@latest my-first-hono-app
```

Then ran the development server:

```sh
npm run dev
```

---

# 🚀 Deploying Hono to Cloudflare

Since Hono supports Cloudflare Workers, we can deploy it directly.

```sh
npx wrangler login
npx wrangler deploy
```

or

```sh
npm run deploy
```

---

# 🔧 Next Step in the Class

After creating the Hono app, we started adding features similar to a typical backend:

* JWT middleware
* Database
* Headers
* Route handling

Just like we do in **Express applications**.

---

# ⚠️ The Problem

At this stage we discovered a major challenge:

> It is difficult to directly connect traditional databases in **serverless environments** like Cloudflare Workers.

This is because:

* Workers run on **edge runtimes**
* They **cannot maintain persistent database connections**
* Traditional ORMs (like Prisma with normal setup) expect a **Node.js runtime**

Because of this, special solutions are required when using databases in serverless environments.
