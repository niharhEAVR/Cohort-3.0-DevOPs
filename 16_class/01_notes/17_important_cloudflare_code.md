Since you already initialized your **Cloudflare Worker**, the next step is to understand the **5 most important things you’ll use while building real APIs with Workers**. Think of these as the **core building blocks** of a Worker backend.

---

# 1. Handling Routes (like Express routing)

In Express you normally do:

```js
app.get("/users", ...)
app.post("/login", ...)
```

Cloudflare Workers **do not have built-in routing**, so you check the URL manually.

### Example

```ts
export default {
  async fetch(request: Request): Promise<Response> {
    
    const url = new URL(request.url)

    if (url.pathname === "/") {
      return new Response("Home page")
    }

    if (url.pathname === "/users") {
      return new Response("Users route")
    }

    return new Response("Not Found", { status: 404 })
  }
}
```

### What happens

If someone visits:

```
/users
```

The worker returns:

```
Users route
```

This is basically **manual routing**.

Many developers use libraries like:

* **Hono**
* **itty-router**

to make Workers feel like Express.

Example with **Hono**

```ts
import { Hono } from "hono"

const app = new Hono()

app.get("/", (c) => c.text("Hello"))
app.get("/users", (c) => c.text("Users"))

export default app
```

Much cleaner.

---

# 2. Reading Request Data (query, body, headers)

Every API needs to read request data.

### Query params

URL:

```
/user?id=25
```

Code:

```ts
const url = new URL(request.url)
const id = url.searchParams.get("id")
```

---

### JSON body (POST request)

Example request body:

```json
{
  "name": "Nihar"
}
```

Worker code:

```ts
const body = await request.json()

return new Response(body.name)
```

---

### Headers

```ts
const token = request.headers.get("Authorization")
```

---

# 3. Sending JSON responses

Most APIs return JSON.

Example:

```ts
return new Response(
  JSON.stringify({
    name: "Nihar",
    role: "developer"
  }),
  {
    headers: {
      "Content-Type": "application/json"
    }
  }
)
```

Response:

```json
{
  "name": "Nihar",
  "role": "developer"
}
```

---

# 4. Using Environment Variables (env)

Secrets and configs go in **wrangler.toml**.

Example:

```
API_KEY = "123456"
```

Worker:

```ts
export default {
  async fetch(request, env) {

    const key = env.API_KEY

    return new Response(key)
  }
}
```

This is how you store:

* API keys
* database credentials
* secret tokens

---

# 5. Edge Databases & Storage

Cloudflare provides several built-in storage systems.

### KV (Key Value)

Fast global storage.

Example:

```ts
await env.MY_KV.put("user", "Nihar")

const value = await env.MY_KV.get("user")
```

Good for:

* sessions
* caching
* config

---

### D1 Database (SQL)

Cloudflare’s SQLite database.

Example:

```ts
const result = await env.DB
  .prepare("SELECT * FROM users")
  .all()
```

Good for:

* relational data
* real apps

---

### R2 (object storage)

Used for storing:

* images
* files
* videos

Like **AWS S3**.

---

# How a Real Worker API looks

Example simple API:

```ts
export default {
  async fetch(request: Request): Promise<Response> {

    const url = new URL(request.url)

    if (url.pathname === "/api/hello") {
      return new Response(
        JSON.stringify({ message: "Hello Nihar" }),
        { headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response("Not found", { status: 404 })
  }
}
```

Visit:

```
/api/hello
```

Response:

```json
{ "message": "Hello Nihar" }
```

---

# The Mental Model (VERY important)

Express:

```
Server -> routes -> response
```

Cloudflare Worker:

```
Edge server
      ↓
fetch(request)
      ↓
your logic
      ↓
Response
```

Everything happens inside **one fetch handler**.

---

# One very important thing for you (as a web dev)

Since you already know:

* Web development
* Backend
* DevOps

The **best stack on Cloudflare Workers** is usually:

```
Workers
Hono (routing)
D1 (database)
KV (cache)
R2 (files)
```

This stack can run an entire **production backend without servers**.
