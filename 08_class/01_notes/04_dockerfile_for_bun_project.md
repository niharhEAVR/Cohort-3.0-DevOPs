You made a simple **`index.ts` Bun backend**, and now you want to **Dockerize it properly**.

I’ll show:

1. ✅ Production-ready Dockerfile
2. ✅ Development Dockerfile
3. 🔥 Why each line exists
4. 🚀 Best practice for real-world deployment

---

# 🧱 Example Project Structure

Let’s assume:

```
my-bun-app/
 ├── index.ts
 ├── package.json
 ├── bun.lockb
 └── tsconfig.json
```

And your `index.ts`:

```ts
import { serve } from "bun";

serve({
  fetch() {
    return new Response("Hello Nihar 🚀");
  },
  port: 3000,
});
```

---

# ✅ Option 1 — Simple Production Dockerfile (Recommended)

```dockerfile
# Use official Bun image
FROM oven/bun:1

# Set working directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Run the app
CMD ["bun", "index.ts"]
```

---

## 🔍 Why Each Line Exists

### `FROM oven/bun:1`

Official Bun Docker image.
Already contains:

* Bun runtime
* Bun package manager

You don’t need to install Node or anything else.

---

### `WORKDIR /app`

Inside container, all files live in `/app`.

---

### `COPY package.json bun.lockb ./`

We copy dependencies first because:

Docker caches layers.

If you change code but not dependencies,
Docker will NOT reinstall everything.

Very important optimization.

---

### `RUN bun install --frozen-lockfile`

* Installs dependencies
* Uses exact versions from lockfile
* Prevents unexpected production bugs

Same concept as:

```bash
npm ci
```

---

### `COPY . .`

Copy your actual source code.

---

### `EXPOSE 3000`

Tells Docker this app runs on port 3000.

---

### `CMD ["bun", "index.ts"]`

Starts the Bun server.

---

# 🚀 How to Build and Run

### Build image:

```bash
docker build -t bun-app .
```

### Run container:

```bash
docker run -p 3000:3000 bun-app
```

Now visit:

```
http://localhost:3000
```

---

# 🔥 Option 2 — Multi-Stage Production Build (More Professional)

If you want a smaller production image:

```dockerfile
# Stage 1: Build
FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun build index.ts --outdir dist

# Stage 2: Production
FROM oven/bun:1
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .

EXPOSE 3000

CMD ["bun", "dist/index.js"]
```

---

## 🧠 Why Multi-Stage?

* First stage builds TS → JS
* Second stage only keeps built files
* Smaller image
* More secure
* Cleaner production

---

# 🏗️ Real World Usage

In production:

* Most Bun apps use the official `oven/bun` image
* Deployed to:

  * AWS ECS
  * DigitalOcean
  * Railway
  * Fly.io
  * Kubernetes

Very similar to Node deployment.

---

# 🔥 Important Production Note

If your Bun server binds to port 3000,
make sure:

```ts
port: process.env.PORT || 3000
```

Because cloud platforms provide dynamic ports.
