### 💡 **Next Step:** Want to scale **on the same machine**? Use the **Cluster Module** to utilize all CPU cores. 🚀

### **What is the Cluster Module in Node.js?**  

The **Cluster Module** in Node.js allows us to take advantage of **multi-core processors** by **creating multiple processes (workers)** that share the same port and handle incoming requests **in parallel**.

---

### **Why Do We Need the Cluster Module?**  
By default, Node.js runs in a **single thread**, meaning it only uses **one CPU core** at a time. This is fine for small apps, but **not for high-traffic applications**.

💡 **Example Problem Without Clustering**  
- If we run a basic Node.js server (`server.js`), all requests go through a **single thread**, using **only one CPU core**.  
- Even if your machine has **8 CPU cores**, the app will still run on just **one core**, wasting the others.  

✅ **Solution: The Cluster Module**  
- It **spawns multiple worker processes**, one for each CPU core.  
- Each worker **handles incoming requests independently**, improving performance.

---

### **How the Cluster Module Works**  

📌 **Concept**  
1. The **Master Process** (parent process) runs first.  
2. The Master process **forks Worker Processes** (child processes), each using a different CPU core.  
3. Each Worker process **runs the same server code**, handling incoming requests.  
4. If a Worker crashes, the Master process **restarts** it automatically.  

🖥 **Diagram Representation**  
```
+-------------+  
|  Master Process  |  (Handles worker creation and monitoring)
+-------------+  
      |  
-------------------------------  
|         |         |         |  
Worker 1   Worker 2   Worker 3   Worker 4  (Each worker runs on a separate core)
```

---

### **Example: Creating a Load-Balanced Server Using Cluster**
```javascript
const cluster = require("cluster");
const http = require("http");
const os = require("os");

const numCPUs = os.cpus().length; // Get number of CPU cores

if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);

    // Fork workers (create child processes)
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Restart a worker if it crashes
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });

} else {
    // Each worker runs this server
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Handled by worker ${process.pid}\n`);
    }).listen(3000);

    console.log(`Worker ${process.pid} started`);
}
```

---

### **How This Works**
1. When you run `node server.js`, the **Master process starts** first.
2. It **spawns multiple Worker processes** (one per CPU core).
3. Each Worker **runs the HTTP server** independently.
4. Requests get distributed **automatically** among the workers.
5. If a Worker crashes, the Master **creates a new one**.

---

### **How to Test This?**
1. Run the script:  
   ```sh
   node server.js
   ```
2. Open a web browser and go to `http://localhost:3000`.  
3. Refresh multiple times. You’ll see different **worker process IDs** handling requests.  
   ```
   Handled by worker 12345
   Handled by worker 67890
   ```

---

### **Benefits of Using the Cluster Module**
✅ Utilizes **all available CPU cores**, improving performance.  
✅ **Handles more requests in parallel**, reducing server response time.  
✅ If a worker crashes, the **app remains stable** because a new worker starts.  
✅ Works great for **horizontal scaling** when combined with **load balancing (e.g., Nginx).**  

---

### **Next Step?**
Now that you understand **how the Cluster module works**, we can take it further by:
- Using **Load Balancers (like Nginx)** to distribute requests across multiple machines.
- Implementing **zero-downtime restarts** for production-ready apps.

🚀 **Do you want to learn how to use Nginx for better horizontal scaling?**


### **Using Nginx for Load Balancing with Node.js (Horizontal Scaling)**
Now that we understand the **Cluster Module**, let’s take **horizontal scaling** to the next level by using **Nginx** as a load balancer.

---

## **Why Use Nginx for Load Balancing?**
Even though the **Cluster Module** helps utilize multiple CPU cores **on the same machine**, what if we want to distribute traffic across **multiple machines**?

✅ **Nginx (Reverse Proxy) Helps:**
- **Distributes requests** across multiple servers (or multiple instances of Node.js apps).
- **Handles more traffic** by balancing the load.
- **Provides failover** – If one server goes down, requests are routed to others.
- **Caches static files**, reducing load on Node.js servers.

---

## **1️⃣ Setup Multiple Node.js Servers**
To demonstrate load balancing, let’s start **two Node.js servers** running on different ports.

### **Server 1 (Port 3001)**
```javascript
const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello from Server 1!\n");
});

server.listen(3001, () => {
    console.log("Server 1 running on port 3001");
});
```

### **Server 2 (Port 3002)**
```javascript
const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello from Server 2!\n");
});

server.listen(3002, () => {
    console.log("Server 2 running on port 3002");
});
```

### **Run Both Servers**
Open two terminals and start both servers:
```sh
node server1.js
node server2.js
```

---

## **2️⃣ Install and Configure Nginx**
### **Step 1: Install Nginx**
For **Linux (Ubuntu/Debian)**
```sh
sudo apt update
sudo apt install nginx
```
For **Windows**, install [Nginx from the official site](https://nginx.org/en/download.html).  
For **Mac**, use Homebrew:
```sh
brew install nginx
```

### **Step 2: Edit the Nginx Configuration**
Open the Nginx configuration file (`/etc/nginx/nginx.conf` on Linux/macOS or `nginx.conf` in the Windows installation folder).

Find the `http {}` block and modify it:

```nginx
http {
    upstream node_servers {
        server 127.0.0.1:3001;
        server 127.0.0.1:3002;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://node_servers;
        }
    }
}
```

---

## **3️⃣ Restart Nginx**
Save the configuration and restart Nginx:
```sh
sudo systemctl restart nginx  # Linux/macOS
nginx -s reload  # Windows
```

---

## **4️⃣ Test Load Balancing**
Now, go to `http://localhost` in your browser and **refresh multiple times**.

👀 **You’ll see different responses from different servers!**
```
Hello from Server 1!
Hello from Server 2!
```

🔄 **Nginx is now distributing traffic across both Node.js servers!** 🚀

---

## **Conclusion**
✅ **Cluster Module** → Uses multiple CPU cores on the same machine.  
✅ **Nginx Load Balancer** → Distributes traffic across multiple Node.js instances (or even different servers).  
✅ **Now your application can handle way more traffic efficiently!**  

---
---
---

### From now on this is very high level understandings so you can skip!!

### **Next Step?**
Want to scale across **multiple machines (not just one)?** → Learn about **Docker and Kubernetes** for containerized deployments. 🚀  
Would you like to see a **Docker-based horizontal scaling setup** next? 🤔



### **Horizontal Scaling with Docker and Nginx for Node.js** 🚀  
Now, let's take **horizontal scaling** to the next level using **Docker** and **Nginx**, allowing us to run multiple Node.js instances across multiple machines!

---

## **Why Use Docker for Scaling?** 🐳  
✅ **Consistency** → Works the same on any machine.  
✅ **Easy Deployment** → Package everything into a container.  
✅ **Scalability** → Run multiple instances effortlessly.  
✅ **Works Across Multiple Machines** → Not limited to a single system like the Cluster Module.

---

## **1️⃣ Create a Simple Node.js App**
Let's create a **basic Node.js server** (`server.js`) that we will run in **multiple Docker containers**.

📂 **Project Structure**
```
/node-docker-app
│── server.js
│── package.json
│── Dockerfile
│── docker-compose.yml
```

### **server.js (Node.js App)**
```javascript
const http = require("http");
const os = require("os");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Hello from Node.js! Running on ${os.hostname()}\n`);
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### **package.json**
```json
{
  "name": "node-docker-app",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {}
}
```

---

## **2️⃣ Create a Dockerfile**
A **Dockerfile** tells Docker how to build and run our app.

📄 **Dockerfile**
```dockerfile
# Use Node.js as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3000 inside the container
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
```

---

## **3️⃣ Use Docker Compose to Run Multiple Containers**
We will use **Docker Compose** to run **three Node.js instances** and **Nginx as a load balancer**.

📄 **docker-compose.yml**
```yaml
version: "3"
services:
  app1:
    build: .
    ports:
      - "3001:3000"

  app2:
    build: .
    ports:
      - "3002:3000"

  app3:
    build: .
    ports:
      - "3003:3000"

  nginx:
    image: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app1
      - app2
      - app3
```

---

## **4️⃣ Configure Nginx for Load Balancing**
📄 **nginx.conf**
```nginx
events {}

http {
    upstream node_servers {
        server app1:3000;
        server app2:3000;
        server app3:3000;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://node_servers;
        }
    }
}
```

---

## **5️⃣ Build and Run Everything with Docker**  
Open a terminal and navigate to your project folder. Run:

```sh
docker-compose up --build
```

This will:  
✅ Build three Node.js containers.  
✅ Start an **Nginx container** as a load balancer.  
✅ Distribute traffic across all Node.js containers.

---

## **6️⃣ Test the Setup**  
Go to `http://localhost` in your browser and refresh multiple times.  

📌 You’ll see different container IDs responding:  
```
Hello from Node.js! Running on 4fd34a6a6c7d
Hello from Node.js! Running on 8bcf2d13aab2
Hello from Node.js! Running on 5a4d2e11b6f1
```
🎉 **Docker and Nginx are now horizontally scaling your Node.js app!** 🚀

---

## **Next Step?**
Would you like to scale across **multiple physical/virtual machines** using **Docker Swarm** or **Kubernetes**? 🤔



### **Scaling Node.js Across Multiple Machines Using Docker Swarm or Kubernetes** 🚀  

Now that we've successfully **scaled a Node.js app on a single machine** using **Docker Compose and Nginx**, let's take it a step further and distribute the load across **multiple physical or virtual machines** using **Docker Swarm** or **Kubernetes (K8s)**.

---

## **Why Scale Across Multiple Machines?**
While **Docker Compose** helps us run multiple containers **on a single machine**, it's still limited by that machine’s CPU and RAM. To handle **more traffic** and ensure **high availability**, we need to distribute workloads **across multiple machines** (servers).  

✅ **Scales beyond a single server**  
✅ **Handles failure of individual servers**  
✅ **Better resource utilization**  
✅ **Can run on a cluster of cloud or on-premise machines**  

---

## **Option 1: Scaling with Docker Swarm** 🐳
Docker Swarm is **Docker’s built-in clustering solution**. It’s **lightweight** and easier to set up than Kubernetes.

### **Step 1: Initialize Swarm**
On the **main manager node**, run:
```sh
docker swarm init --advertise-addr <manager-IP>
```
This initializes a Swarm cluster.

### **Step 2: Add Worker Nodes**
On other machines (workers), run:
```sh
docker swarm join --token <TOKEN> <MANAGER-IP>:2377
```
Now, these machines are part of the Swarm.

### **Step 3: Deploy the Node.js App**
We’ll deploy **multiple Node.js services** using a Swarm stack (`docker-compose.yml` for Swarm).

📄 **docker-stack.yml**
```yaml
version: "3.8"

services:
  node-app:
    image: my-node-app
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
    ports:
      - "3000:3000"
    networks:
      - my-network

  nginx:
    image: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    networks:
      - my-network
    deploy:
      replicas: 1

networks:
  my-network:
```

### **Step 4: Deploy the Stack**
On the manager node, run:
```sh
docker stack deploy -c docker-stack.yml my-stack
```
This deploys the **Node.js services** across the Swarm cluster.

🎉 Now, **Docker Swarm automatically distributes traffic across multiple machines!** 🚀  

---

## **Option 2: Scaling with Kubernetes (K8s)**
Kubernetes is a **more powerful, production-grade orchestration tool** used by large-scale applications.

### **Step 1: Install Kubernetes**
- For **local testing**, use [Minikube](https://minikube.sigs.k8s.io/docs/start/).
- For **production**, set up Kubernetes on cloud providers like **AWS, GCP, or Azure**.

### **Step 2: Define Kubernetes Deployments**
📄 **node-app-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: node-app
  template:
    metadata:
      labels:
        app: node-app
    spec:
      containers:
        - name: node-app
          image: my-node-app
          ports:
            - containerPort: 3000
```

📄 **nginx-service.yaml**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: node-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

### **Step 3: Deploy to Kubernetes**
```sh
kubectl apply -f node-app-deployment.yaml
kubectl apply -f nginx-service.yaml
```

This deploys **three instances of the Node.js app**, automatically distributing traffic across all machines.

---

## **Which One Should You Use?**
| Feature  | Docker Swarm 🐳 | Kubernetes ☸️ |
|----------|---------------|---------------|
| **Ease of Setup**  | ✅ Simple | ❌ Complex |
| **Scaling** | 🚀 Good | 🔥 Best |
| **Self-Healing** | ✅ Limited | ✅ Advanced |
| **Cloud Native** | ❌ No | ✅ Yes |
| **Best For** | Small to Medium Apps | Large Scale Production |

---

## **Final Thoughts**
- **For simple scaling**, use **Docker Swarm** (easier, built into Docker).  
- **For large-scale production**, use **Kubernetes** (powerful, used in cloud computing).  
- Both can work with **Nginx** as a **load balancer**.

🚀 **Do you want a guide on deploying a Kubernetes cluster on AWS/GCP?** 🤔


### **Deploying a Kubernetes Cluster on AWS (EKS) or GCP (GKE)** 🚀  

Now, let's take your **Node.js horizontal scaling setup** and deploy it on a **real cloud environment** using **Kubernetes**. We will cover **AWS Elastic Kubernetes Service (EKS)** and **Google Kubernetes Engine (GKE)**.

---

## **1️⃣ Choose Your Cloud Provider**
### **📌 AWS (EKS) vs GCP (GKE)**
| Feature  | AWS EKS 🟠 | GCP GKE 🔵 |
|----------|----------|----------|
| **Ease of Setup**  | ❌ Complex | ✅ Easier |
| **Pricing** | Expensive 💰 | Cheaper 💵 |
| **Performance** | 🔥 High | 🚀 High |
| **Best For** | Enterprise 💼 | Startups & Mid-Sized Companies 🚀 |

⏩ **If you are just testing Kubernetes, GKE is easier.**  
⏩ **For enterprise-level workloads, EKS is better.**

---

# **🚀 Option 1: Deploy on AWS EKS**
## **Step 1: Install AWS CLI & eksctl**
Before setting up Kubernetes, install these tools:
```sh
# Install AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Install eksctl (EKS management tool)
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```

## **Step 2: Configure AWS & Create Cluster**
Login and configure AWS:
```sh
aws configure
```
Then create an EKS cluster with 3 nodes:
```sh
eksctl create cluster --name my-cluster --region us-west-2 --nodegroup-name my-nodes --nodes 3
```
💡 This will take **10-15 minutes**. It sets up a **Kubernetes cluster** with **3 worker nodes**.

## **Step 3: Verify Kubernetes Cluster**
```sh
kubectl get nodes
```
You should see **3 worker nodes** running.

---

## **Step 4: Deploy Node.js App on AWS EKS**
📄 **node-app-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: node-app
  template:
    metadata:
      labels:
        app: node-app
    spec:
      containers:
        - name: node-app
          image: my-node-app
          ports:
            - containerPort: 3000
```

📄 **nginx-service.yaml**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: node-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

### **Deploy to EKS**
```sh
kubectl apply -f node-app-deployment.yaml
kubectl apply -f nginx-service.yaml
```
Now, Kubernetes will **distribute traffic** across all instances.

### **Get the Load Balancer URL**
```sh
kubectl get services
```
Copy the **External IP** and access your app online! 🎉

---

# **🚀 Option 2: Deploy on Google Cloud GKE**
## **Step 1: Install Google Cloud SDK**
```sh
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```
Login to your Google Cloud account:
```sh
gcloud auth login
```

## **Step 2: Create a GKE Cluster**
```sh
gcloud container clusters create my-cluster --num-nodes=3
```
This sets up **3 Kubernetes worker nodes**.

## **Step 3: Connect to Kubernetes**
```sh
gcloud container clusters get-credentials my-cluster
kubectl get nodes
```
🎉 Now, your Kubernetes cluster is ready!

## **Step 4: Deploy Node.js App on GKE**
Use the same **node-app-deployment.yaml** and **nginx-service.yaml** files from the AWS example.

Deploy them to GKE:
```sh
kubectl apply -f node-app-deployment.yaml
kubectl apply -f nginx-service.yaml
```

## **Step 5: Get the Public IP**
```sh
kubectl get services
```
Copy the **External IP** of the **LoadBalancer**, and open it in a browser. 🚀

---

# **🎯 Which One Should You Choose?**
| Feature  | AWS EKS 🟠 | GCP GKE 🔵 |
|----------|----------|----------|
| **Easy to Set Up?**  | ❌ No | ✅ Yes |
| **Performance?** | 🔥🔥🔥 | 🔥🔥 |
| **Pricing?** | 💰 Expensive | 💵 Cheaper |
| **Best For?** | Large Enterprises | Startups, Mid-Sized Apps |

If you **just want to test Kubernetes**, **use GKE**.  
If you **want high scalability**, **use EKS**.

---

# **🔥 What’s Next?**
Would you like to:
1️⃣ **Deploy a CI/CD Pipeline for Kubernetes using GitHub Actions?** 🤔  
2️⃣ **Scale using Helm for Kubernetes Apps?** 🏗️  

Let me know what excites you! 🚀

Great! 🚀 I'll break it down into two parts:  

1️⃣ **CI/CD Pipeline for Kubernetes using GitHub Actions** 🛠️  
2️⃣ **Scaling Kubernetes Apps using Helm** ⎈  

Let’s start with **CI/CD in Kubernetes** using **GitHub Actions**. 🔥  

---

# **1️⃣ CI/CD Pipeline for Kubernetes using GitHub Actions**
## **Why CI/CD for Kubernetes?**
✅ Automates **building, testing, and deploying** your app  
✅ Ensures smooth **continuous integration** (CI) & **continuous deployment** (CD)  
✅ Avoids **manual errors** by deploying code changes automatically  

---

## **🛠️ Step 1: Setup a Kubernetes Cluster**  
You should already have a **Kubernetes cluster** (EKS or GKE) running. If not, refer to our previous guide.  

---

## **🛠️ Step 2: Create a Docker Image & Push to DockerHub/GCR/ECR**
First, **build & push** your Docker image.

### **📄 Dockerfile**
```dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "server.js"]
EXPOSE 3000
```

### **Push to Docker Hub**
```sh
docker build -t myusername/my-node-app:latest .
docker push myusername/my-node-app:latest
```
🔹 Replace `myusername` with your **DockerHub username**.  

---

## **🛠️ Step 3: Create Kubernetes Deployment & Service Files**
### **📄 node-app-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: node-app
  template:
    metadata:
      labels:
        app: node-app
    spec:
      containers:
        - name: node-app
          image: myusername/my-node-app:latest
          ports:
            - containerPort: 3000
```

### **📄 node-app-service.yaml**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: node-app-service
spec:
  selector:
    app: node-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

---

## **🛠️ Step 4: Create a GitHub Actions Workflow**
We will automate:  
✅ **Building the Docker image**  
✅ **Pushing to Docker Hub**  
✅ **Deploying to Kubernetes**  

📄 **.github/workflows/deploy.yml**
```yaml
name: Deploy to Kubernetes

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v3

    - name: Set up Docker
      uses: docker/setup-buildx-action@v2

    - name: Log in to DockerHub
      run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

    - name: Build & Push Docker Image
      run: |
        docker build -t myusername/my-node-app:latest .
        docker push myusername/my-node-app:latest

    - name: Set up kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: v1.27.3

    - name: Deploy to Kubernetes
      run: |
        kubectl apply -f node-app-deployment.yaml
        kubectl apply -f node-app-service.yaml
```
🔹 **Store your DockerHub credentials** in **GitHub Secrets** as:  
- `DOCKER_USERNAME`  
- `DOCKER_PASSWORD`  

### **✅ Now, every time you push to `main`, it automatically deploys to Kubernetes!** 🎉  

---

# **2️⃣ Scaling Kubernetes Apps with Helm** 🏗️  
Helm is the **package manager for Kubernetes**, making it easy to **deploy and manage** applications.

---

## **🛠️ Step 1: Install Helm**
```sh
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
helm version
```
This installs **Helm 3**.

---

## **🛠️ Step 2: Create a Helm Chart**
Create a new Helm chart:
```sh
helm create my-node-app
cd my-node-app
```

### **📄 Update `values.yaml`**
```yaml
replicaCount: 3

image:
  repository: myusername/my-node-app
  tag: latest
  pullPolicy: Always

service:
  type: LoadBalancer
  port: 80
  targetPort: 3000
```

---

## **🛠️ Step 3: Deploy Using Helm**
```sh
helm install node-app ./my-node-app
```
This deploys the app **using Helm**. 🎉

---

# **Final Thoughts**
✅ **CI/CD with GitHub Actions** automates deployments  
✅ **Helm** simplifies scaling and managing Kubernetes apps  

🚀 **Do you want a Helm chart template for your project?** 🤔