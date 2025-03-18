```sh


docker network create testing

docker network ls 

docker run --name mongoDb --network testing mongo # and remember to put the same name in db.ts connection url, something like this: mongodb://mongoDb:27017/myDatabase

docker build -t testing-app .

docker run --name backend --network testing -p 3000:3000 testing-app

docker network rm testing

```



---
---
---
---




Let's break down each command in **very detailed** steps. 🚀  

---

## **1️⃣ Building the Docker Image**
```sh
docker build -t testing-app .
```
### **🔍 Explanation:**
- `docker build` → This command **builds** a Docker image from the `Dockerfile` in the **current directory (`.`)**.
- `-t testing-app` → This **tags** the image with the name `"testing-app"`, so you can refer to it later when running a container.

### **🛠 What This Does:**
1. Reads the `Dockerfile`.
2. Executes each step inside the `Dockerfile` (like copying files, installing dependencies, etc.).
3. Saves the resulting image under the name **"testing-app"**.

---

## **2️⃣ Creating a Docker Network**
```sh
docker network create testing
```
### **🔍 Explanation:**
- `docker network create` → Creates a new **custom network**.
- `testing` → The **name** of the network.

### **🛠 Why Do We Need This?**
- Containers in the **same network** can **communicate using their names** instead of IP addresses.
- Example: The **backend** can reach **MongoDB** using `mongodb://mongoDb:27017/myDatabase` instead of an IP.

---

## **3️⃣ Checking Available Networks**
```sh
docker network ls
```
### **🔍 Explanation:**
- `docker network ls` → Lists all **Docker networks** available on your system.

### **🛠 What You Will See:**
You should see an output like this:
```
NETWORK ID     NAME      DRIVER    SCOPE
f8a2d3e7c8d5  bridge    bridge    local
9baf5a9bded1  host      host      local
d56fa93278a3  none      null      local
a1b2c3d4e5f6  testing   bridge    local
```
The `testing` network should be listed.

---

## **4️⃣ Running MongoDB in the Docker Network**
```sh
docker run --name mongoDb --network testing mongo
```
### **🔍 Explanation:**
- `docker run` → Creates and starts a new container.
- `--name mongoDb` → Assigns the **container name** as `"mongoDb"`.
- `--network testing` → Connects the container to the **"testing"** network.
- `mongo` → Uses the **MongoDB image** (pulled from Docker Hub if not available locally).

### **🛠 What Happens?**
- A new container named `"mongoDb"` starts.
- It listens on the **default MongoDB port** (`27017`).
- Other containers in the `"testing"` network can access it using the name `"mongoDb"`.

### **💡 Important!**
- The connection URL in your app should be:  
  ```
  mongodb://mongoDb:27017/myDatabase
  ```
  instead of:
  ```
  mongodb://localhost:27017/myDatabase
  ```
  Because **localhost won't work inside Docker** unless you use `"host.docker.internal"`.

---

## **5️⃣ Running the Backend Container**
```sh
docker run --name backend --network testing -p 3000:3000 testing-app
```
### **🔍 Explanation:**
- `docker run` → Creates and starts a new container.
- `--name backend` → Names the container `"backend"`.
- `--network testing` → Connects it to the `"testing"` network.
- `-p 3000:3000` → Maps **port 3000 inside Docker** to **port 3000 on your machine**.
- `testing-app` → Runs the Docker image we built earlier.

### **🛠 What Happens?**
- A new container named `"backend"` starts.
- It runs the **Node.js app** inside the container.
- The app **listens on port 3000** inside the container.
- Your computer can access the app via `http://localhost:3000`.

---

## **6️⃣ Deleting the Docker Network**
If you want to **delete the `testing` network**, run:
```sh
docker network rm testing
```
### **🔍 Explanation:**
- `docker network rm` → Deletes a **Docker network**.
- `testing` → The name of the network to delete.

### **💡 Important Notes:**
- If **containers are still using the network**, you **cannot delete it**.
- Stop and remove the containers first:
  ```sh
  docker stop mongoDb backend
  docker rm mongoDb backend
  docker network rm testing
  ```

---

### **🛠 TL;DR (Summary)**
| **Command** | **Action** |
|------------|-----------|
| `docker build -t testing-app .` | Builds a Docker image named `"testing-app"` |
| `docker network create testing` | Creates a custom network named `"testing"` |
| `docker network ls` | Lists all Docker networks |
| `docker run --name mongoDb --network testing mongo` | Runs a MongoDB container inside the `"testing"` network |
| `docker run --name backend --network testing -p 3000:3000 testing-app` | Runs the backend container and connects it to MongoDB |
| `docker network rm testing` | Deletes the `"testing"` network (only if no containers are using it) |




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
mongodb://mongoDb:27017/myDatabase
```
- Here, `mongoDb` is the **name of the MongoDB container**.
- Docker’s built-in **DNS resolves container names to IP addresses**.

#### ✅ **If MongoDB is running on your Host Machine**
If MongoDB is **not in a container** and runs on your **host machine**, then use:
```sh
mongodb://host.docker.internal:27017/myDatabase
```
- `host.docker.internal` is a **special DNS name** in Docker that maps to your host machine.
- This allows a container to reach services running **outside** Docker.

---

### **🔍 Recap**
| **MongoDB Location** | **Connection String** | **Reason** |
|----------------------|----------------------|------------|
| **Inside another container (same network)** | `mongodb://mongoDb:27017/myDatabase` | Docker’s internal DNS resolves the container name. |
| **On your host machine** | `mongodb://host.docker.internal:27017/myDatabase` | Special DNS name maps to the host. |
| **Wrong approach (inside the container itself)** | `mongodb://localhost:27017/myDatabase` | The container tries to connect to itself, not the host. |




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