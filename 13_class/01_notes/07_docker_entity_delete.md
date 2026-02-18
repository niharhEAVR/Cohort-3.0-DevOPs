```sh
> sudo docker ps
CONTAINER ID   IMAGE                            COMMAND                  CREATED       STATUS       PORTS       NAMES
b9a42bd7a59f   mongo                            "docker-entrypoint.s…"   2 hours ago   Up 2 hours   27017/tcp   happy_ride
7e6bb551bff9   newrelic/infrastructure:latest   "/sbin/tini -- /usr/…"   2 hours ago   Up 2 hours               newrelic-infra
```

To **permanently delete** these Docker containers (not just stop them), you need to do **two steps**:

# ✅ **Step 1: Stop the container**

```sh
sudo docker stop happy_ride
sudo docker stop newrelic-infra
```

This stops MongoDB and the New Relic agent containers.

---

# ✅ **Step 2: Remove (delete) the container permanently**

```sh
sudo docker rm happy_ride
sudo docker rm newrelic-infra
```

After this, the containers are **permanently removed** and will not start again unless you run `docker run` manually.

---

# 🚨 OPTIONAL but IMPORTANT

```sh
> sudo docker images
```

If you want to delete the **IMAGE** also (so it frees disk space):

### Delete Mongo image:

```sh
sudo docker rmi mongo:latest
```

### Delete New Relic image:

```sh
sudo docker rmi newrelic/infrastructure:latest
```

---

# ⭐ To verify:

Run:

```sh
sudo docker ps -a
```

You should see **no containers** for mongo or newrelic-infra.

---

# ⭐ If you want to delete ALL containers at once

⚠️ careful — this deletes everything

```sh
sudo docker rm -f $(sudo docker ps -aq)
```

---







---
---
---
---

# ✅ **What you already did**

You ran:

```
sudo docker stop <container_id>
sudo docker rm <container_id>
```

If those commands succeeded for the **New Relic agent container**, then:

### ✔ The New Relic container is deleted

### ✖ But the New Relic **image** may still remain on your machine

Containers and images are **different**:

| Item          | Meaning            | Example                          |
| ------------- | ------------------ | -------------------------------- |
| **Container** | Running instance   | `newrelic-infra`                 |
| **Image**     | Blueprint/template | `newrelic/infrastructure:latest` |

Stopping & deleting the container **does NOT remove the image**.

---

# 🔍 **Check if the image still exists**

Run this:

```
sudo docker images
```

Look for:

```
newrelic/infrastructure   latest
```

If you see it → the image is still there.

---

# 🗑 How to permanently delete the image

If the container is removed, you can delete the image:

```
sudo docker rmi newrelic/infrastructure:latest
```

If Docker gives an error like:

```
image is being used by container <id>
```

Then the container still exists → delete it first:

```
sudo docker rm -f newrelic-infra
```

Then delete the image again.

---

# 🟢 **How to confirm that the agent is 100% gone**

Run:

```
sudo docker ps -a
sudo docker images
```

If:

* no `newrelic-infra` container
* no `newrelic/infrastructure` image

Then **the agent is fully deleted**.

---

# ❗ BUT — one more important thing

Since your agent was a Docker container, it only monitored the host **while running**.
Once you delete the container:

### New Relic will still show the entity for some time

because New Relic keeps "offline" entities visible for **up to 24 hours**.

After that, it disappears automatically.

---

# If you want it to disappear immediately

You cannot delete it from New Relic because:

**INFRA-CONTAINER entities cannot be deleted manually.**

They disappear automatically when:

* agent stops sending data
* entity goes stale for ~24 hours

So don't worry — it will vanish soon.