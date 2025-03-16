# **1️⃣ What is a Dockerfile?**  
A **Dockerfile** is like a **recipe** that tells Docker **how to create an image**.  
- It contains **instructions** that Docker follows **step-by-step** to build an image.  
- After running `docker build`, Docker will create an image based on this Dockerfile.  

---

### **Understanding Your Dockerfile**
```dockerfile
FROM node:22-alpine
```
✅ **`FROM node:22-alpine`**  
- This **sets the base image** as `node:22-alpine`.  
- **"Alpine"** means it is a **lightweight** version of Node.js (smaller size, better performance).  

---

```dockerfile
WORKDIR /app
```
✅ **`WORKDIR /app`**  
- This **sets the working directory** inside the container to `/app`.  
- All the following commands will be executed inside `/app`.  
- Equivalent to running:
  ```bash
  cd /app
  ```
  inside a VM.

---

```dockerfile
COPY . .
```
✅ **`COPY . .`**  
- This **copies all files** from your local machine’s **current directory (`.`)** to the container’s **`/app` directory**.  
- This ensures that your source code is available inside the container.

---

```dockerfile
RUN npm install
```
✅ **`RUN npm install`**  
- This **installs all dependencies** from `package.json`.  
- It’s like running:
  ```bash
  npm install
  ```
  inside a VM, but it happens **during image creation**.

---

```dockerfile
EXPOSE 3001
```
✅ **`EXPOSE 3001`**  
- This **tells Docker** that the container will listen on port **3001**.  
- But it **does not** actually map the port—you do that with `docker run -p`.

---

```dockerfile
CMD ["node", "index.js"]
```
✅ **`CMD ["node", "index.js"]`**  
- This is the **default command** that runs when the container starts.  
- Equivalent to running:
  ```bash
  node index.js
  ```
  inside a VM.  
- This means your **Node.js app will start automatically** when the container runs.

---

## **2️⃣ What is `.dockerignore`?**
A **.dockerignore** file tells Docker **which files/folders to ignore** when copying files into the container.  

Your `.dockerignore` file:  
```
node_modules
```
✅ **`node_modules` is ignored**  
- This prevents Docker from copying **`node_modules/`** into the container.  
- Instead, `npm install` will **reinstall dependencies inside the container**, making sure it works correctly.

---

## **3️⃣ What do these commands do?**

### **`docker build -t hello-world-app .`**
✅ **Builds a Docker image** from the **Dockerfile**  
- `-t hello-world-app` → Names the image as `hello-world-app`.  
- `.` → Uses the **current directory** as the **build context** (Dockerfile must be inside this directory).  
- Runs all **Dockerfile steps** (`FROM`, `WORKDIR`, `COPY`, `RUN`, `EXPOSE`, `CMD`).  

After running this, check your image list with:
```bash
docker images
```
Expected output:
```
REPOSITORY         TAG       IMAGE ID       CREATED          SIZE
hello-world-app    latest    abcd1234       10 seconds ago   200MB
```

---

### **`docker images`**
✅ **Lists all Docker images** available on your machine.  
Example output:
```
REPOSITORY         TAG       IMAGE ID       CREATED          SIZE
hello-world-app    latest    abcd1234       10 seconds ago   200MB
node              22-alpine  xyz5678        5 days ago       50MB
```
Each image can be used to create containers.

---

### **`docker run -p 3001:3001 hello-world-app`**
✅ **Starts a container** from `hello-world-app` and maps ports.  
- `-p 3001:3001` → Maps **port 3001 of the container** to **port 3001 on your machine**.  
- Now, if your Node.js app runs on `http://localhost:3001` inside the container, you can access it from **your browser** at:  
  ```
  http://localhost:3001
  ```

---

### **`docker ps`**
✅ **Lists all running containers.**  
Example output:
```
CONTAINER ID   IMAGE           COMMAND               STATUS         PORTS          NAMES
123456abcd     hello-world-app "node index.js"      Up 5 minutes   0.0.0.0:3001->3001/tcp   my-container
```
- `CONTAINER ID` → Unique identifier of the running container.  
- `IMAGE` → Shows which image was used.  
- `COMMAND` → Shows the process running inside the container.  
- `PORTS` → **3001 on your machine** is connected to **3001 inside the container**.

---

### **`docker kill <container_id>`**
✅ **Stops a running container immediately.**  
- Replace `<container_id>` with the actual ID from `docker ps`.  
Example:
```bash
docker kill 123456abcd
```
Now, if you check `docker ps`, the container will be gone.

---

## **💡 Summary**
| Command | What it does |
|---------|-------------|
| `docker build -t hello-world-app .` | Builds an image from the Dockerfile |
| `docker images` | Lists all available Docker images |
| `docker run -p 3001:3001 hello-world-app` | Starts a container with port mapping |
| `docker ps` | Shows running containers |
| `docker kill <container_id>` | Kills a running container |

---

## **🔥 Want to Try?**
1. **Run all these commands step by step.**  
2. **Check your running container with `docker ps`.**  
3. **Try accessing `http://localhost:3001`.**  
4. **Kill the container with `docker kill <container_id>`.**  
5. **Ask me if anything breaks!** 😃

---
---
---

## **4️⃣ `docker build`**
📌 **Purpose:** Builds a custom Docker image from a `Dockerfile`.  
📌 **Usage:**  
```bash
docker build -t my-image:1.0 .
```
**Explanation:**
- `-t my-image:1.0` → Tags the image as `my-image` with version `1.0`.  
- `.` → Build context (current directory with `Dockerfile`).  

📌 **Example `Dockerfile`:**
```dockerfile
FROM ubuntu:latest
RUN apt-get update && apt-get install -y curl
CMD ["bash"]
```
📌 **Build from a specific directory:**
```bash
docker build -t my-image /path/to/directory
```