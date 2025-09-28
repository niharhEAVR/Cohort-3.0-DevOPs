# 📦 Types of Docker Volumes

Docker supports **3 main ways** of persisting and sharing data between containers:

---

## 1. **Named Volumes**

* **Created and managed by Docker.**
* Lives under Docker’s directory:
  `/var/lib/docker/volumes/<volume_name>/_data`
* You give it a name, so you can reuse it across containers.

### Example:

```bash
# Create a named volume
docker volume create mydata

# Run a container using it
docker run -d --name my_mongo -v mydata:/data/db mongo
```

➡️ Now, if you remove the container and run a new one with `-v mydata:/data/db`, the database files will still be there.

**Use case:** Databases (Mongo, MySQL, Postgres), file persistence.

---

## 2. **Anonymous Volumes**

* Docker creates them automatically **without a name** if you don’t specify one.
* Stored in the same location as named volumes (`/var/lib/docker/volumes/`), but the name is a random hash.
* Hard to reuse because you don’t know the name unless you inspect the container.

### Example:

```bash
docker run -d -v /data/db mongo
```

➡️ Docker generates something like:
`/var/lib/docker/volumes/6b35c2c98c3b29/_data`

If the container is removed, the anonymous volume usually becomes **dangling** (unused, taking up disk).

**Use case:** Quick tests, temporary data, not recommended for production.

---

## 3. **Bind Mounts**

* Directly **mounts a directory or file from the host machine** into the container.
* Not managed by Docker — you control the path.
* Whatever is in your host folder appears inside the container.

### Example:

```bash
# Use host folder ./app mapped to /usr/src/app in container
docker run -d -v $(pwd)/app:/usr/src/app node
```

➡️ Now changes on your host (`./app`) reflect instantly inside the container, and vice versa.

**Use case:**

* Development (live code changes without rebuilding).
* Accessing specific host files (configs, certs, logs).

---

# ⚙️ How They Work Internally

* When you use `-v` or `--mount`, Docker overlays the container’s filesystem with the volume.
* Anything inside the volume path `/data/db` will actually be stored in the **volume location** instead of the container’s ephemeral writable layer.
* This ensures:

  1. Data is not lost when the container is removed.
  2. Multiple containers can read/write the same volume.

---

# 📌 Quick Comparison

| Type               | Managed by Docker | Path Location             | Reusable? | Best Use Case                     |
| ------------------ | ----------------- | ------------------------- | --------- | --------------------------------- |
| **Named Volume**   | ✅ Yes             | `/var/lib/docker/volumes` | ✅ Yes     | Databases, production persistence |
| **Anonymous Vol.** | ✅ Yes (random)    | `/var/lib/docker/volumes` | ❌ Hard    | Short-lived containers            |
| **Bind Mount**     | ❌ User managed    | Any host path you specify | ✅ Yes     | Dev, configs, logs                |

---

# 🚀 Real-world Example

Imagine you’re running a WordPress site:

* **MySQL database** → Named volume (`db_data:/var/lib/mysql`)
* **WordPress files** → Bind mount (`./site:/var/www/html`)
* This way, the DB persists across container recreations, and you can edit site files directly on your host.

---

👉 **Summary:**

* **Named Volumes** = production-ready, Docker-managed persistence.
* **Anonymous Volumes** = temporary, not practical long-term.
* **Bind Mounts** = direct host ↔ container sync, great for dev or configs.
