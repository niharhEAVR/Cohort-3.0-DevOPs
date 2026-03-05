Good question. In **Hono**, things like **JWT authentication, database connections, headers, etc.** are added using **middleware**, very similar to **Express.js**, but with a cleaner structure.

---

# 1️⃣ Express Style (what you already know)

In Express you usually do:

```js
app.use(jwtMiddleware)
app.use(cors())
app.use(databaseMiddleware)

app.get('/users', handler)
```

Middleware runs **before the route handler**.

---

# 2️⃣ Hono Middleware Concept

In Hono the same thing is done using:

```ts
app.use()
```

Example:

```ts
app.use('*', middleware)
```

`*` means **run for every route**.

---

# 3️⃣ Adding JWT Middleware

Hono already provides a JWT middleware.

```bash
npm install hono
```

Example:

```ts
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

const app = new Hono()

app.use(
  '/protected/*',
  jwt({
    secret: 'my-secret'
  })
)

app.get('/protected/user', (c) => {
  return c.json({ message: 'Authorized user' })
})

export default app
```

Now every route under:

```
/protected/*
```

requires a **JWT token**.

---

# 4️⃣ Adding Headers Middleware

Example: set headers for every request.

```ts
app.use('*', async (c, next) => {
  await next()

  c.header('X-App-Name', 'My-Hono-App')
})
```

You can also set CORS headers.

---

# 5️⃣ Adding a Database (Best Practice)

Instead of connecting to the database inside every route, we attach it to **context**.

Example:

```ts
app.use('*', async (c, next) => {
  const db = "my-db-connection"

  c.set('db', db)

  await next()
})
```

Then inside routes:

```ts
app.get('/users', (c) => {
  const db = c.get('db')

  return c.json({ db })
})
```

---

# 6️⃣ Full Example (JWT + DB + Headers)

```ts
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

const app = new Hono()

// DB middleware
app.use('*', async (c, next) => {
  const db = "database-connection"
  c.set('db', db)

  await next()
})

// headers middleware
app.use('*', async (c, next) => {
  await next()
  c.header('X-Powered-By', 'Hono')
})

// JWT middleware
app.use('/api/*', jwt({ secret: 'my-secret' }))

app.get('/api/user', (c) => {
  const db = c.get('db')
  return c.json({ message: 'Authorized', db })
})

export default app
```

Flow:

```
Request
   ↓
DB middleware
   ↓
Headers middleware
   ↓
JWT middleware
   ↓
Route handler
   ↓
Response
```

---

# 7️⃣ Even Better Structure (Real Projects)

Real Hono apps usually organize like this:

```
src
 ├ middleware
 │   ├ auth.ts
 │   ├ db.ts
 │   └ headers.ts
 ├ routes
 │   ├ auth.ts
 │   └ users.ts
 └ index.ts
```

Then import them.

---

💡 Since you're learning **Cloudflare Workers + Hono**, the **modern stack developers use is**:

```
Hono
+ JWT auth
+ Zod validation
+ Prisma / Drizzle
+ Cloudflare D1
```

This gives you a **full production backend on the edge**.
