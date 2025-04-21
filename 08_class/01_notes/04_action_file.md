### I actually forgots of explaining the action files, so here is a explanation of one action file:

```yml
name: Deploy the frontend
on:
  push:
    branches: [ main ]
jobs: 
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout the code
        uses: actions/checkout@v2

      - name: Docker login
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_PASSWORD }}
      
      - name: Build and push 
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./docker/Dockerfile.web
          build-args: |
            DATABASE_URL=${{ secrets.NEONDB_URL }}
          push: true
          tags: niharlnx/web:${{ github.sha }}

      - name: Deploy to the VM
        run: |
            echo "${{ secrets.SSH_PRIVATE_KEY_LAPTOP }}" > ~/ssh_key
            chmod 600 ~/ssh_key
            ssh -o StrictHostKeyChecking=no -i ~/ssh_key ubuntu@65.2.144.189 -t "
              sudo docker stop web || true && \
              sudo docker rm web || true && \
              sudo docker run -d -p 3000:3000 --name web niharlnx/web:${{ github.sha }}
              sleep 10
              sudo docker ps"
```


Let's break this GitHub Actions workflow down **step-by-step** in *very detailed terms* so you get a crystal-clear understanding of what’s happening at every stage.

---

## ✅ **Overview: What is this GitHub Actions file doing?**

This workflow:
- **Triggers** when someone pushes code to the `main` branch.
- **Builds a Docker image** for the frontend app (from `Dockerfile.web`).
- **Pushes that image to Docker Hub.**
- Then **SSHs into a remote VM** (a server on AWS EC2 in this case), **stops the running container (if any)**, removes it, and **starts a new container** using the latest Docker image.

---

### 🧾 Let's go through it line by line:

---

### `name: Deploy the frontend`
This sets the name of the GitHub Action workflow — so in the GitHub Actions tab, you’ll see this name in the list of workflows.

---

### `on: push: branches: [ main ]`
This tells GitHub **when to run this workflow**.  
In this case, it will trigger **only when someone pushes code to the `main` branch.**

---

### `jobs: build:`
This defines a job called `build`.  
Each job runs in its own virtual environment (an Ubuntu VM in this case).

---

### `runs-on: ubuntu-latest`
This means: "Run this job inside the latest available Ubuntu VM provided by GitHub Actions."

---

## 🧱 `steps:` – This is where the actual tasks begin

Each step is something GitHub Actions will run one-by-one inside that Ubuntu VM.

---

### 🔹 Step 1: **Checkout the code**
```yaml
- name: Checkout the code
  uses: actions/checkout@v2
```
- This uses a GitHub Action (`actions/checkout@v2`) that clones your GitHub repository (including your frontend code, Dockerfile, etc.) into the virtual machine.
- Without this, the job wouldn’t have access to your code at all.

---

### 🔹 Step 2: **Docker login**
```yaml
- name: Docker login
  uses: docker/login-action@v2
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_PASSWORD }}
```
- This logs in to your Docker Hub account using your credentials stored in GitHub Secrets:
  - `DOCKERHUB_USERNAME`: your Docker Hub username
  - `DOCKERHUB_PASSWORD`: your password or token
- This is necessary so you can **push** Docker images to your Docker Hub repository.

---

### 🔹 Step 3: **Build and push the Docker image**
```yaml
- name: Build and push 
  uses: docker/build-push-action@v4
  with:
    context: .
    file: ./docker/Dockerfile.web
    build-args: |
      DATABASE_URL=${{ secrets.NEONDB_URL }}
    push: true
    tags: niharlnx/web:${{ github.sha }}
```

- `context: .` → The root directory is sent to Docker as the build context.
- `file: ./docker/Dockerfile.web` → Specifies the Dockerfile used to build the frontend.
- `build-args:` → Passes environment variables (in this case, `DATABASE_URL`) at build time using a secret from GitHub.
- `push: true` → Tells Docker to **push the built image** to Docker Hub.
- `tags: niharlnx/web:${{ github.sha }}`:
  - This tags the Docker image using your Docker Hub repo (`niharlnx/web`), and uses the **Git commit hash** (`github.sha`) as the tag — so each image is uniquely versioned.

---

### 🔹 Step 4: **Deploy to the VM**
```yaml
- name: Deploy to the VM
  run: |
    echo "${{ secrets.SSH_PRIVATE_KEY_LAPTOP }}" > ~/ssh_key
    chmod 600 ~/ssh_key
    ssh -o StrictHostKeyChecking=no -i ~/ssh_key ubuntu@65.2.144.189 -t "
      sudo docker stop web || true && \
      sudo docker rm web || true && \
      sudo docker run -d -p 3000:3000 --name web niharlnx/web:${{ github.sha }}
      sleep 10
      sudo docker ps"
```

This step remotely accesses your **AWS EC2 instance** and starts the new frontend container.

Let’s go line by line:

---

#### 🔐 Create a temporary SSH key
```bash
echo "${{ secrets.SSH_PRIVATE_KEY_LAPTOP }}" > ~/ssh_key
chmod 600 ~/ssh_key
```
- Reads your **private SSH key** from GitHub Secrets (named `SSH_PRIVATE_KEY_LAPTOP`) and writes it into a temp file `~/ssh_key`.
- Sets secure permissions so only the owner can read/write it.

---

#### 🌐 Connect to the EC2 instance
```bash
ssh -o StrictHostKeyChecking=no -i ~/ssh_key ubuntu@65.2.144.189 -t "
```
- Uses `ssh` to connect to the EC2 instance at IP `65.2.144.189` using username `ubuntu`.
- The `-o StrictHostKeyChecking=no` bypasses the prompt asking "Are you sure you want to connect?"
- `-i ~/ssh_key`: use the private key stored earlier.
- `-t` allows pseudo-terminal allocation (useful for remote commands).

---

#### 🧹 Stop & remove the existing container
```bash
sudo docker stop web || true && \
sudo docker rm web || true &&
```
- Tries to stop and remove the existing container named `web`.
- `|| true` ensures that even if there's an error (e.g., container doesn't exist), the script continues without failing.

---

#### 🚀 Run the new Docker container
```bash
sudo docker run -d -p 3000:3000 --name web niharlnx/web:${{ github.sha }}
```
- Starts the new version of your frontend from Docker Hub.
- Exposes port `3000` on the server.
- Runs the container in the background (`-d`) and names it `web`.

---

#### ⏱ Small delay + confirm it's running
```bash
sleep 10
sudo docker ps"
```
- Waits 10 seconds for the container to spin up.
- Runs `docker ps` to show running containers (for confirmation/debugging).

---

## 🔐 Summary of Required Secrets:

You need to define these in your GitHub repo's **Settings > Secrets and variables > Actions**:

| Secret Name             | What it contains                         |
|-------------------------|------------------------------------------|
| `DOCKERHUB_USERNAME`    | Your Docker Hub username                 |
| `DOCKERHUB_PASSWORD`    | Your Docker Hub password or access token |
| `NEONDB_URL`            | Your NeonDB PostgreSQL connection string |
| `SSH_PRIVATE_KEY_LAPTOP`| Your private SSH key for EC2 access      |

---

## 💡 In Summary:

This GitHub Action automates:
1. Building the frontend Docker image with proper env vars.
2. Pushing it to Docker Hub with a unique tag.
3. Logging into your EC2 VM and deploying the **latest image automatically** — all triggered just by pushing to the `main` branch.

---
---
---

### More details explanation

Absolutely — let’s break this down *even deeper* so every part makes total sense. We'll walk through this GitHub Actions file **step-by-step**, with context, real-world examples, and explanations of how GitHub Actions works under the hood.

---

### 🔧 **What is this Action file for?**
This file is a **CI/CD pipeline**.

- **CI (Continuous Integration)** part: It builds and packages your frontend code into a Docker image every time you push changes to the `main` branch.
- **CD (Continuous Deployment)** part: It deploys that updated image to your **live server (AWS EC2 VM)** automatically.

---

## 🔷 Full Code: Let's restate it for context

```yaml
name: Deploy the frontend
on:
  push:
    branches: [ main ]
jobs: 
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout the code
        uses: actions/checkout@v2

      - name: Docker login
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_PASSWORD }}
      
      - name: Build and push 
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./docker/Dockerfile.web
          build-args: |
            DATABASE_URL=${{ secrets.NEONDB_URL }}
          push: true
          tags: niharlnx/web:${{ github.sha }}

      - name: Deploy to the VM
        run: |
            echo "${{ secrets.SSH_PRIVATE_KEY_LAPTOP }}" > ~/ssh_key
            chmod 600 ~/ssh_key
            ssh -o StrictHostKeyChecking=no -i ~/ssh_key ubuntu@65.2.144.189 -t "
              sudo docker stop web || true && \
              sudo docker rm web || true && \
              sudo docker run -d -p 3000:3000 --name web niharlnx/web:${{ github.sha }}
              sleep 10
              sudo docker ps"
```

---

## 🔍 Step-by-Step Explanation

---

### ✅ **Workflow Trigger:**
```yaml
on:
  push:
    branches: [ main ]
```

**This is the trigger.**  
When you `git push` to the `main` branch of your GitHub repository, this workflow starts automatically.

> 📌 GitHub monitors your repo and starts a "runner" when the condition is met.

---

### 🧱 **Job Definition**
```yaml
jobs: 
  build:
    runs-on: ubuntu-latest
```

You're defining a **job** named `build`, and telling GitHub to run it on a **Linux VM** (Ubuntu, the latest version available).

Each job:
- Runs on a fresh virtual machine
- Starts from scratch (no files or Docker installed unless you install it yourself or use preinstalled actions)

---

## 🪜 Steps Breakdown

---

### 🔹 Step 1: Checkout the Code
```yaml
- name: Checkout the code
  uses: actions/checkout@v2
```

This is necessary because:
- GitHub runners don't know your repo files by default
- This pulls your code (like `apps/web`, `Dockerfile`, etc.) into the runner’s filesystem

> 💡 Without this, the Docker build would fail because it has no files to work with.

---

### 🔹 Step 2: Docker Login
```yaml
- name: Docker login
  uses: docker/login-action@v2
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_PASSWORD }}
```

**Why do this?**
- You’re about to `docker push` to Docker Hub.
- That needs authentication.
- You store your username and password as GitHub **Secrets** so it stays secure.

> 📌 This avoids hardcoding sensitive info into the file.

---

### 🔹 Step 3: Build and Push the Docker Image
```yaml
- name: Build and push 
  uses: docker/build-push-action@v4
```

This is the heart of CI. You're:
1. **Building a Docker image** using `Dockerfile.web`
2. **Passing environment variables** (like `DATABASE_URL`) via `--build-arg`
3. **Pushing the image** to your Docker Hub repo `niharlnx/web`
4. **Tagging the image** with the commit hash (`${{ github.sha }}`) to make it unique

> 💡 Using commit hash allows version tracking and rollback if needed.

### Visual:
Imagine you push new code → GitHub Actions runs → creates `niharlnx/web:afcd2e3` → pushes to Docker Hub.

---

### 🔹 Step 4: Deploy to the EC2 Server
```yaml
- name: Deploy to the VM
  run: |
```

Let’s go **line by line** inside this step:

#### 1. 🔐 **Write the SSH key**
```bash
echo "${{ secrets.SSH_PRIVATE_KEY_LAPTOP }}" > ~/ssh_key
chmod 600 ~/ssh_key
```

- Creates a file `~/ssh_key` from your **GitHub Secret**
- Changes permission to 600 → **only owner can read/write** (required for SSH to work)

> 🚨 Very important for SSH security!

---

#### 2. 🌐 **SSH into EC2**
```bash
ssh -o StrictHostKeyChecking=no -i ~/ssh_key ubuntu@65.2.144.189 -t "
```

- Connects to your server at IP `65.2.144.189`
- Uses the SSH key (`~/ssh_key`)
- Logs in as `ubuntu` (default user on EC2 Ubuntu VMs)
- `-t` opens a shell session

---

#### 3. 🧹 **Stop and remove old container**
```bash
sudo docker stop web || true && \
sudo docker rm web || true &&
```

- Stops the running container named `web` (if any)
- Removes it to clean up resources
- `|| true`: makes sure script doesn’t break if the container doesn’t exist

---

#### 4. 🚀 **Start the new container**
```bash
sudo docker run -d -p 3000:3000 --name web niharlnx/web:${{ github.sha }}
```

- Pulls the image you pushed to Docker Hub
- Runs it in detached mode (`-d`)
- Maps host port `3000` to container port `3000`
- Names the container `web`

Now your frontend is **live on your EC2 instance** at `http://65.2.144.189:3000`.

---

#### 5. 💤 Wait and Verify
```bash
sleep 10
sudo docker ps"
```

- Waits 10 seconds (to give the container time to start)
- Runs `docker ps` to list running containers → helps verify deployment

---

## 📦 Secrets Summary

| Secret Name               | Description                                     |
|---------------------------|-------------------------------------------------|
| `DOCKERHUB_USERNAME`      | Your Docker Hub username                        |
| `DOCKERHUB_PASSWORD`      | Docker Hub password or token                    |
| `NEONDB_URL`              | PostgreSQL database connection string from Neon |
| `SSH_PRIVATE_KEY_LAPTOP`  | Private key to SSH into your EC2 server         |

---

## ✅ What You Gain From This

- 💨 Fully automated CI/CD pipeline
- 🚫 No manual SSH or `docker build`/`push` commands
- 🧼 Safe, versioned deployments via GitHub Actions
- 🔁 Re-runnable by simply pushing new code to `main`

---

If you'd like, I can:
- Show how this works for `backend` or `ws` too
- Help you **split monorepo builds** (TurboRepo-style)
- Create a diagram for visual understanding

Let me know!