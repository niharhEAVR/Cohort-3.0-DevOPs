Great observation — and you're absolutely right! Let me break it down for you clearly:

---

### ✅ When you're **using Docker CLI (manual setup)**:
You have to **explicitly create and connect containers to a shared Docker network**, like:

```bash
docker network create testing
```

Why?  
Because otherwise, Docker runs each container in **its own isolated network**, and they can't "see" each other unless they're in the **same custom network**.

---

### ✅ When you're using **`docker-compose.yml`**:
You **don’t need to define a network manually**, because:

> Docker Compose automatically creates a **default bridge network** for your app, and connects all defined services to it.

So by default:
- All services (like `postgres` and `user-app`) are placed on the same **default network** (e.g., `projectname_default`).
- They can refer to each other by **service name as hostname** (e.g., `postgres`).

That's why this works:

```yaml
DATABASE_URL=postgresql://postgres:me@postgres:5432
```

Even though no `network:` is explicitly defined — Docker Compose is handling that for you behind the scenes.

---

### 🧠 Bonus Tip: Want to see the network in Compose?

After running:
```bash
docker-compose up
```

Run:
```bash
docker network ls
```

You'll see something like:
```
NETWORK ID     NAME               DRIVER    SCOPE
xyz123         myproject_default  bridge    local
```

---

### ✅ You *can* define custom networks if you want more control:

```yaml
networks:
  mynetwork:

services:
  postgres:
    networks:
      - mynetwork

  user-app:
    networks:
      - mynetwork
```

But for most basic setups, the **default Compose network** is more than enough. It keeps things clean and simple.
