## **1️⃣ `docker images`**
📌 **Purpose:** Lists all Docker images stored locally on your machine.  
📌 **Usage:**  
```bash
docker images
```
📌 **Output Explanation:**
| REPOSITORY | TAG | IMAGE ID | CREATED | SIZE |
|------------|-----|----------|---------|------|
| mongo | latest | a1b2c3d4 | 2 days ago | 500MB |

- **REPOSITORY** → Name of the image (e.g., `mongo`).  
- **TAG** → Version of the image (default is `latest`).  
- **IMAGE ID** → Unique identifier for the image.  
- **CREATED** → When the image was created.  
- **SIZE** → Size of the image.

📌 **Additional Flags:**
```bash
docker images -a  # Show all images, including intermediate layers
docker images --filter "dangling=true"  # Show only untagged (dangling) images
```

---

## **2️⃣ `docker ps`**
📌 **Purpose:** Lists all running containers on your machine.  
📌 **Usage:**  
```bash
docker ps
```
📌 **Output Explanation:**
| CONTAINER ID | IMAGE | COMMAND | CREATED | STATUS | PORTS | NAMES |
|--------------|-------|---------|---------|--------|-------|-------|
| abcd1234 | mongo | "docker-entrypoint.sh" | 2 hours ago | Up | 27017:27017 | mongodb-container |

- **CONTAINER ID** → Unique identifier for the running container.  
- **IMAGE** → Image used to create the container.  
- **COMMAND** → Command executed inside the container.  
- **STATUS** → Running, exited, or paused.  
- **PORTS** → Port mappings (e.g., `27017:27017`).  
- **NAMES** → Auto-assigned or custom container name.

📌 **Show all containers (including stopped ones):**
```bash
docker ps -a
```

---

## **3️⃣ `docker run`**
📌 **Purpose:** Creates and starts a container from an image.  
📌 **Usage:**  
```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```
📌 **Example:**
```bash
docker run -d -p 27017:27017 --name my-mongo mongo
```
**Explanation:**
- `-d` → Runs in **detached mode** (background).  
- `-p 27017:27017` → Maps port **27017 of the container** to **27017 on the host**.  
- `--name my-mongo` → Assigns a custom name to the container (`my-mongo`).  
- `mongo` → The image to run.  

📌 **Run an interactive container:**
```bash
docker run -it ubuntu bash
```
- `-i` → Interactive mode (keeps STDIN open).  
- `-t` → Allocates a terminal inside the container.  

📌 **Automatically remove container after exit:**
```bash
docker run --rm ubuntu echo "Hello World"
```


---

## **5️⃣ `docker push`**
📌 **Purpose:** Uploads (pushes) a local image to a Docker registry (like Docker Hub).  
📌 **Usage:**  
```bash
docker push my-username/my-image:1.0
```
**Steps to Push an Image:**
1. Log in to Docker Hub:
   ```bash
   docker login
   ```
2. Tag the image:
   ```bash
   docker tag my-image my-username/my-image:1.0
   ```
3. Push the image:
   ```bash
   docker push my-username/my-image:1.0
   ```

📌 **Example Output:**
```bash
The push refers to repository [docker.io/my-username/my-image]
1.0: digest: sha256:abcd1234 size: 200MB
```

---

## **6️⃣ Extra Commands**
### **🔹 `docker kill`**
📌 **Purpose:** Immediately stops a running container.  
📌 **Usage:**  
```bash
docker kill <container_id>
```
📌 **Example:**
```bash
docker kill abcd1234
```
This **forcibly stops** the container **without waiting** for cleanup.

📌 **Kill multiple containers:**
```bash
docker kill $(docker ps -q)
```
---

### **🔹 `docker exec`**
📌 **Purpose:** Runs a command inside a running container.  
📌 **Usage:**  
```bash
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```
📌 **Example:**
```bash
docker exec -it my-mongo bash
```
- `-i` → Interactive mode.  
- `-t` → Allocates a terminal.  
- `my-mongo` → Name of the running container.  
- `bash` → Opens a shell inside the container.

📌 **Run a single command inside a container:**
```bash
docker exec my-mongo mongo --eval "db.stats()"
```

---

## **🛠 Summary Table of Commands**
| Command | Description |
|---------|------------|
| `docker images` | List all Docker images |
| `docker ps` | Show running containers |
| `docker ps -a` | Show all containers (including stopped ones) |
| `docker run -d -p 8080:80 nginx` | Run an Nginx container in detached mode |
| `docker build -t my-image .` | Build an image from a `Dockerfile` |
| `docker push my-username/my-image` | Push an image to Docker Hub |
| `docker kill <container_id>` | Force stop a running container |
| `docker exec -it <container> bash` | Open an interactive shell in a running container |


---
---
---


### 1️⃣ **List all Docker images**  
Before deleting, check the available images:
```bash
docker images
```
or  
```bash
docker image ls
```

### 2️⃣ **Remove a specific image**  
Use the `IMAGE ID` or `IMAGE NAME` from the above command:
```bash
docker rmi <image_id>
```
or  
```bash
docker rmi <image_name>:<tag>
```
Example:
```bash
docker rmi mongo
```

### 3️⃣ **Remove multiple images**  
```bash
docker rmi <image_id1> <image_id2>
```

### 4️⃣ **Remove all images**  
⚠️ **Warning:** This will delete all images!
```bash
docker rmi $(docker images -q)
```

### 5️⃣ **Force remove an image**  
If an image is being used by a running container, first stop the container:
```bash
docker stop <container_id>
```
Then, force remove the image:
```bash
docker rmi -f <image_id>
```



---
---
---


## **1️⃣ Testing `docker push`**
📌 **Purpose:** Upload a Docker image to a registry (like Docker Hub).  

### **Steps to Push an Image**  

### ✅ **Step 1: Log in to Docker Hub**
Run this command and enter your **Docker Hub username** and **password**:
```bash
docker login
```

---

### ✅ **Step 2: Check Available Images**
List your images to find one you want to push:
```bash
docker images
```
Example output:
```
REPOSITORY      TAG       IMAGE ID       CREATED       SIZE
my-app         latest    abcd1234        2 hours ago   250MB
mongo          latest    efgh5678        3 days ago    500MB
```

---

### ✅ **Step 3: Tag the Image**  
Docker requires images to be tagged with your **Docker Hub username** before pushing.  
Format:
```bash
docker tag <image_id> <your_dockerhub_username>/<image_name>:<tag>
```
Example:
```bash
docker tag abcd1234 my-dockerhub-user/my-app:1.0
```

---

### ✅ **Step 4: Push the Image**  
Now, push the tagged image to Docker Hub:
```bash
docker push my-dockerhub-user/my-app:1.0
```
If successful, you'll see output like:
```
The push refers to repository [docker.io/my-dockerhub-user/my-app]
1.0: digest: sha256:xyz123abcd size: 250MB
```

---

### ✅ **Step 5: Verify on Docker Hub**
Go to **[hub.docker.com](https://hub.docker.com/)**, log in, and check your repository.

---

### **🛑 Troubleshooting `docker push` Issues**
- If you see **"denied: requested access to the resource is denied"**, it means:
  - You are not logged in → Run `docker login`
  - You haven't tagged the image correctly → Check `docker images`
- If the image is **too large**, try minimizing the `Dockerfile` by using a **smaller base image**.

---

## **2️⃣ Testing `docker exec`**
📌 **Purpose:** Run commands inside a running container.

### ✅ **Step 1: Start a Container**
First, make sure you have a running container. If you don’t, start one:
```bash
docker run -d --name my-container ubuntu sleep infinity
```
This runs an **Ubuntu** container in the background.

---

### ✅ **Step 2: Check Running Containers**
```bash
docker ps
```
Example output:
```
CONTAINER ID   IMAGE    COMMAND              STATUS          NAMES
abcd1234       ubuntu   "sleep infinity"     Up 5 minutes    my-container
```
Now, we have a container named **`my-container`** running.

---

### ✅ **Step 3: Open a Terminal Inside the Container**
Run:
```bash
docker exec -it my-container bash
```
- `-i` → Interactive mode  
- `-t` → Allocates a terminal  
- `my-container` → Name of the running container  
- `bash` → Opens a shell inside the container  

Now, you are **inside** the container! Your prompt will change:
```
root@abcd1234:/#
```
You can now run **Linux commands** inside the container.

---

### ✅ **Step 4: Run Commands Inside the Container**
Try:
```bash
ls
```
```bash
cat /etc/os-release
```
This shows the OS details inside the container.

---

### ✅ **Step 5: Exit the Container**
To leave the container’s shell:
```bash
exit
```
or press **Ctrl + D**.

---

### ✅ **Step 6: Run a Command Without Opening a Shell**
Instead of opening a full shell, you can directly run a command inside the container:
```bash
docker exec my-container ls /
```
This will list the root directory (`/`) of the container **without opening a shell**.

---

### **🛑 Troubleshooting `docker exec` Issues**
- If you get **"Error: No such container"**, check if the container is running:
  ```bash
  docker ps
  ```
- If you get **"executable file not found in $PATH"**, try using `sh` instead of `bash`:
  ```bash
  docker exec -it my-container sh
  ```

---

### **🔹 Summary**
| Command | Purpose |
|---------|---------|
| `docker login` | Log in to Docker Hub |
| `docker tag <image_id> <your_username>/<image_name>:<tag>` | Tag an image before pushing |
| `docker push <your_username>/<image_name>:<tag>` | Push image to Docker Hub |
| `docker exec -it my-container bash` | Open a terminal inside a running container |
| `docker exec my-container ls /` | Run a command inside a container without opening a shell |
| `exit` | Leave the container shell |

---
---
---

### **1️⃣ `docker push` (Sharing Images)**
When you push an image to **Docker Hub**, anyone can **pull** and use it **if it's public**.  
- Example: If you push `my-dockerhub-user/my-app:1.0`, others can run:
  ```bash
  docker pull my-dockerhub-user/my-app:1.0
  docker run -d my-dockerhub-user/my-app:1.0
  ```
- **Public Images:** Anyone can pull them.  
- **Private Images:** Only you (or authorized users) can access them.

---

### **2️⃣ `docker exec` (Accessing the Container Like a VM)**
Yes! **`docker exec` lets you enter a running container**, just like logging into a VM.  
- Once inside, you can **install packages, check logs, modify files, and debug** the container.  
- Example:
  ```bash
  docker exec -it my-container bash
  ```
  This opens a **terminal inside the container**—just like SSH-ing into a server or opening a VM.

---
---
---
---
---
---
---
---





# 🗑 Remove a Specific Docker Network

```bash
docker network rm <network-name>
```

Example:

```bash
docker network rm monitoring
```

---

# ⚠ If You Get Error (Network in Use)

It means containers are still connected.

First stop & remove containers:

```bash
docker ps
docker stop <container_name>
docker rm <container_name>
```

Then remove network:

```bash
docker network rm monitoring
```

---

# 🧹 Remove ALL Unused Networks

```bash
docker network prune
```

It will ask confirmation.

---

# 🔍 See Existing Networks

```bash
docker network ls
```


---
---
---
---
---




## 🔹 1️⃣ `docker-compose up`

This command:

* Creates containers (if not created)
* Starts containers
* Uses **existing images**
* Does **NOT rebuild** images

👉 If you already built your image earlier, it will just reuse that image.

### Example situation:

You have:

```yaml
services:
  app:
    build: .
```

You run:

```bash
docker-compose up
```

If the image was already built before, Docker will **not rebuild** it — even if you changed your source code (unless you're using volumes for live reload).

---

## 🔹 2️⃣ `docker-compose up --build`

This command:

* **Forces a rebuild of images**
* Then starts containers
* Recreates containers if needed

👉 Even if nothing changed, it will rebuild the image again.

---

## 🔥 Real-world Example (Very Important for You)

Suppose:

* You modified your `Dockerfile`
* OR you installed a new npm package
* OR you changed backend code
* OR you changed environment variables inside Docker build

If you run:

```bash
docker-compose up
```

❌ It might still use the old image
So your changes won’t reflect.

But if you run:

```bash
docker-compose up --build
```

✅ It rebuilds the image
✅ Includes new dependencies
✅ Then starts the container

---

## 🧠 When Should You Use What?

| Situation                       | Command                     |
| ------------------------------- | --------------------------- |
| First time running project      | `docker-compose up --build` |
| After changing Dockerfile       | `docker-compose up --build` |
| After installing new dependency | `docker-compose up --build` |
| Just restarting containers      | `docker-compose up`         |
| No code change                  | `docker-compose up`         |

---

## 💡 Pro Tip (Dev Workflow)

During development, if you mount code like this:

```yaml
volumes:
  - .:/app
```

Then you usually don’t need `--build` for code changes — only for dependency or Dockerfile changes.

---

## 🚀 Bonus: Faster Clean Rebuild

If things get weird (you know that Docker weirdness 😅):

```bash
docker-compose down
docker-compose up --build
```

If still weird:

```bash
docker-compose down --volumes --remove-orphans
docker-compose up --build
```



---
---
---
---
---
---
---



# 🔹 `docker-compose down`

This command:

👉 **Stops and removes everything created by `docker-compose up`**

That includes:

* ✅ Containers
* ✅ Networks (created by compose)
* ❌ NOT images (by default)
* ❌ NOT volumes (by default)

---

## 🧠 What Exactly Happens?

When you run:

```bash
docker-compose down
```

Docker will:

1. Stop all running containers
2. Remove those containers
3. Remove the default network created for the project

So it basically cleans up the running environment.

---

## 🔥 Difference Between `stop` and `down`

### 🔹 `docker-compose stop`

* Stops containers
* Containers still exist
* You can restart them with `docker-compose start`

### 🔹 `docker-compose down`

* Stops containers
* Deletes containers
* Deletes network

Think like this:

* `stop` = Pause
* `down` = Destroy (but not images)

---

## 🔥 What About Volumes?

By default:

```bash
docker-compose down
```

❌ Does NOT remove volumes
So your database data remains safe.

If you want to remove volumes too:

```bash
docker-compose down --volumes
```

⚠️ This will delete:

* DB data
* Redis data
* Any named volumes

Use carefully.

---

## 🔥 What About Images?

If you also want to remove images:

```bash
docker-compose down --rmi all
```

Now it will:

* Remove containers
* Remove networks
* Remove images

---

# 💻 Real Example (Your Node + Prometheus Setup)

You run:

```bash
docker-compose up --build
```

Now:

* Node app running
* Prometheus running
* Network created

Later you want a clean reset:

```bash
docker-compose down
```

Now:

* Both containers gone
* Network gone
* Images still exist
* Next `up` will start fresh containers from image

---

# 🧠 When Should You Use `down`?

✔ When something is behaving weird
✔ When you want a clean restart
✔ Before switching branches
✔ When port conflicts happen
✔ When testing fresh container behavior

---

# 🚀 Best Dev Reset Pattern

If things feel broken:

```bash
docker-compose down
docker-compose up --build
```

If database corruption or stale volume issue:

```bash
docker-compose down --volumes
docker-compose up --build