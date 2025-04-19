### Explore the 02_nodejs_project then Read this document

```sh
cd 06_class/02_nodejs_project
docker network create testing

docker network ls 

docker run -d -p 27017:27017 --name mongoDb --network testing mongo # and remember to put the same name in db.ts connection url, something like this: mongodb://mongoDb:27017/users

docker build -t users-app .

docker run -d -p 3000:3000 --name backend --network testing users-app

docker network rm testing
```
---
Absolutely! Let's break down each of these commands **in very very detailed, beginner-friendly terms** so you know exactly what each line is doing and **why** you’re doing it.

---

## 🔧 Step-by-Step Breakdown

---

### ✅ **1. Change Directory**

```sh
cd 06_class/02_nodejs_project
```

📁 This means:

- You're going inside a folder named `02_nodejs_project`, which is inside another folder called `06_class`.
- This is likely your **Node.js backend project**.
- You need to be in this directory because the **Dockerfile** and source code are here for the build step.

---

### ✅ **2. Create a Docker Network**

```sh
docker network create testing
```

💡 This does the following:

- Creates a **custom Docker network** named `testing`.
- It's like setting up a **private LAN (local area network)** for your containers.
- Any container attached to this network can **talk to other containers** inside it **by name** (not by IP).

Why?  
Because your **Node.js app needs to talk to MongoDB**, and they need to be on the same network to do that.

---

### ✅ **3. List Docker Networks**

```sh
docker network ls
```

🔍 This shows all the networks that exist on your system.

You’ll see something like:

```
NETWORK ID     NAME      DRIVER    SCOPE
abc123         bridge    bridge    local
xyz456         host      host      local
def789         testing   bridge    local
```

Check if your `testing` network was created correctly.

---

### ✅ **4. Run MongoDB Container in the Network**

```sh
docker run -d -p 27017:27017 --name mongoDb --network testing mongo
```

🔥 Let’s break it down piece by piece:

| Part | Meaning |
|------|---------|
| `docker run` | Start a new container. |
| `-d` | Detached mode — runs in background. |
| `-p 27017:27017` | Maps port 27017 of your **host machine** to port 27017 inside the container. MongoDB uses 27017 by default. |
| `--name mongoDb` | Names your container `mongoDb`. You’ll use this name in your Node.js connection URL. |
| `--network testing` | Connects this MongoDB container to the `testing` network you created. |
| `mongo` | This is the **official MongoDB Docker image** from Docker Hub. |

👉 Now, from any container inside the `testing` network, you can connect to MongoDB like this:

```ts
mongodb://mongoDb:27017/users
```

- `mongoDb` here refers to the **container name**, not localhost.
- `users` is the database name.

---

### ✅ **5. Build Your Node.js App as a Docker Image**

```sh
docker build -t users-app .
```

🛠 This builds your app into a Docker image.

| Part | Meaning |
|------|---------|
| `docker build` | Build an image from a Dockerfile. |
| `-t users-app` | Tags the image with the name `users-app`. You’ll use this name to run the container. |
| `.` | Use the **current directory** as the build context (where your `Dockerfile` and source code are). |

So now Docker reads your `Dockerfile`, installs dependencies, sets up your app, and **creates an image** you can run.

---

### ✅ **6. Run the Node.js App Container**

```sh
docker run -d -p 3000:3000 --name backend --network testing users-app
```

🚀 This launches your app using the image you just built.

| Part | Meaning |
|------|---------|
| `-d` | Runs in detached/background mode. |
| `-p 3000:3000` | Maps port 3000 on your local machine to port 3000 inside the container. |
| `--name backend` | Gives the container the name `backend`. |
| `--network testing` | Connects the container to the same `testing` network so it can talk to MongoDB. |
| `users-app` | The name of the image you built earlier. |

Now your backend app is:

- Running in its own container
- Connected to the MongoDB container
- Able to talk to it using `mongodb://mongoDb:27017/users`

---

### ✅ **7. Delete the Docker Network (⚠️ Dangerous if still running containers)**

```sh
docker network rm testing
```

🧨 This removes the `testing` network from Docker.

BUT — it only works if **no containers are using the network**.  
If your containers are still running and attached to `testing`, this will fail.

You should **stop or remove** the containers first:

```sh
docker stop backend mongoDb
docker rm backend mongoDb
docker network rm testing
```

---

## 📌 Summary of What You Did

| Action | What Happened |
|--------|----------------|
| `cd` into project | Moved to the project folder |
| Create network | Allowed containers to talk to each other |
| Start MongoDB | Set up your database container |
| Build Node.js app | Created a Docker image of your backend |
| Run backend | Started your app container in same network |
| Remove network | Optional cleanup (only after stopping containers) |

---
---
---


### **Why Doesn’t `localhost` Work Inside a Docker Container?**
When you run a service inside a **Docker container**, it has its **own isolated network environment**. This means:

1. **Each container has its own `localhost` (127.0.0.1)**  
   - Inside a Docker container, `localhost` refers to the container **itself**, not your host machine.
   - If your app inside the container tries to connect to `mongodb://localhost:27017`, it's looking for a MongoDB server **inside the same container**, which doesn’t exist (unless you installed MongoDB in the same container, which is not recommended).

2. **Docker’s Default Network Isolation**  
   - By default, Docker runs containers in an **isolated environment** with a private network.
   - Containers **cannot access services running on your host machine** via `localhost` unless explicitly configured.

---

### **How to Fix It?**
#### ✅ **If MongoDB is running in another container (Best Practice)**
Instead of using `localhost`, use the **container name** (if both containers are in the same Docker network):
```sh
mongodb://mongoDb:27017/users
```
- Here, `mongoDb` is the **name of the MongoDB container**.
- Docker’s built-in **DNS resolves container names to IP addresses**.

#### ✅ **If MongoDB is running on your Host Machine**
If MongoDB is **not in a container** and runs on your **host machine**, then use:
```sh
mongodb://host.docker.internal:27017/users
```
- `host.docker.internal` is a **special DNS name** in Docker that maps to your host machine.
- This allows a container to reach services running **outside** Docker.

---

### **🔍 Recap**
| **MongoDB Location** | **Connection String** | **Reason** |
|----------------------|----------------------|------------|
| **Inside another container (same network)** | `mongodb://mongoDb:27017/users` | Docker’s internal DNS resolves the container name. |
| **On your host machine** | `mongodb://host.docker.internal:27017/users` | Special DNS name maps to the host. |
| **Wrong approach (inside the container itself)** | `mongodb://localhost:27017/users` | The container tries to connect to itself, not the host. |




---
---
---


### **Purpose of Creating a Docker Network and Connecting Containers**  
When you run multiple Docker containers that need to communicate, you **must** create a Docker network. This ensures **seamless and secure communication** between them.  

---

## **Why Do We Create a Docker Network?**
### 🚀 **1. Container-to-Container Communication**  
- **By default, containers are isolated** and can’t talk to each other unless connected to the same network.  
- A Docker **bridge network** allows containers to communicate using **container names instead of IP addresses**.

### 🔒 **2. Security & Isolation**  
- Instead of exposing services on the host machine, we keep them within a **private network**, reducing security risks.
- Containers **outside the network** cannot access services inside it.

### 🌍 **3. Automatic Service Discovery (DNS Resolution)**  
- If two containers are on the same network, one can **refer to another by its container name**.
- Example:  
  - A **MongoDB container** named `mongoDb`  
  - A **backend container** needing to connect to MongoDB  
  - The backend can use `mongodb://mongoDb:27017/myDatabase` instead of needing an IP.

---

## **Explanation of Commands**
```sh
docker network create testing
```
- **Creates a new Docker network** named `testing`.
- This is a **bridge network** by default, allowing communication between containers.

```sh
docker run --name mongoDb --network testing mongo
```
- Starts a **MongoDB container** named `mongoDb` and **connects it to the `testing` network**.
- Inside any other container in the same network, you can now reach MongoDB using `mongodb://mongoDb:27017/myDatabase`.

```sh
docker run --name backend --network testing -p 3000:3000 testing-app
```
- Runs a container named `backend`, connects it to the **same** `testing` network.
- The `-p 3000:3000` flag makes the backend accessible **outside Docker** via `http://localhost:3000`.

---

## **What Happens Without a Network?**
- If you **don’t** specify `--network testing`, each container gets a **randomly assigned** network and **won't see the other containers**.
- The backend **cannot** reach MongoDB using `mongoDb:27017` because **it’s on a different network**.

---

## **Command to Delete the Network**
```sh
docker network rm testing
```
- Deletes the `testing` network.
- **Important:** You must first **stop and remove all containers using the network** before deleting it.

---

## **Summary**
| **Action** | **Command** | **Purpose** |
|------------|------------|------------|
| Create a network | `docker network create testing` | Allows containers to communicate |
| Run MongoDB container | `docker run --name mongoDb --network testing mongo` | Connects MongoDB to the network |
| Run backend container | `docker run --name backend --network testing -p 3000:3000 testing-app` | Allows backend to talk to MongoDB |
| Delete network | `docker network rm testing` | Removes the network (must stop containers first) |