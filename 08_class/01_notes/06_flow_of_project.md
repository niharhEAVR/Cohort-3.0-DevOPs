# 🧠 Big Picture

This file is a **CI/CD pipeline using GitHub Actions**.

It is teaching you:

> "When code changes → automatically build → push Docker image → deploy to server"

No manual SSH.
No manual docker build.
No manual restart.

Fully automated deployment.

---

# 🚀 Step-By-Step Flow (What Actually Happens)

## 🔹 Step 1 — Trigger

```yaml
on:
  push:
    branches: [ main ]
```

Meaning:

Whenever you push to `main` branch →

GitHub automatically starts this workflow.

So:

```
git push origin main
        ↓
GitHub Actions starts
```

This teaches:
👉 Production deployments are triggered by version control.

---

## 🔹 Step 2 — Create a Virtual Machine (Runner)

```yaml
runs-on: ubuntu-latest
```

GitHub creates a temporary Ubuntu machine.

This machine will:

* Clone your repo
* Build Docker image
* Push image
* SSH into your server

After workflow finishes → VM is destroyed.

This teaches:
👉 CI environments are temporary & stateless.

---

## 🔹 Step 3 — Checkout Code

```yaml
uses: actions/checkout@v2
```

Clones your GitHub repository into that temporary VM.

Now the runner has your project files.

---

## 🔹 Step 4 — Docker Login

```yaml
uses: docker/login-action@v2
```

Logs into Docker Hub using secrets:

```
DOCKERHUB_USERNAME
DOCKERHUB_PASSWORD
```

Why?

Because it needs permission to push image.

This teaches:
👉 Never hardcode credentials.
👉 Use GitHub Secrets.

---

## 🔹 Step 5 — Build & Push Docker Image

```yaml
uses: docker/build-push-action@v4
```

This:

1. Reads `./docker/Dockerfile.backend`
2. Builds Docker image
3. Tags it as:

```
niharlnx/backend:${{ github.sha }}
```

Example:

```
niharlnx/backend:3f9a2d1c
```

`github.sha` = unique commit hash.

This is VERY IMPORTANT.

Why?

Because every deployment is versioned.

You can roll back to older versions easily.

Then:

```
push: true
```

It pushes image to Docker Hub.

This teaches:
👉 Immutable deployments.
👉 Version-based images.
👉 Docker as deployment artifact.

---

# 🔥 Up Until Now

We have:

```
Code → Docker Image → Docker Hub
```

Now comes the real deployment part.

---

# 🔹 Step 6 — SSH Into Your VM

```bash
ssh ubuntu@65.2.144.189
```

It connects to your cloud VM.

Using:

```
SSH_PRIVATE_KEY_LAPTOP
```

Stored in GitHub Secrets.

This teaches:
👉 Secure remote deployment.
👉 Automated SSH.

---

# 🔹 Step 7 — Stop Old Container

```bash
sudo docker stop backend || true
sudo docker rm backend || true
```

If container exists:

* Stop it
* Remove it

`|| true` prevents crash if container doesn’t exist.

This teaches:
👉 Idempotent deployment.
👉 Safe restarts.

---

# 🔹 Step 8 — Run New Container

```bash
sudo docker run --name backend -d -p 8080:8080 \
-e DATABASE_URL=... \
niharlnx/backend:${{ github.sha }}
```

This:

* Pulls latest image from Docker Hub
* Runs container
* Maps port 8080
* Injects environment variable

This is important:

You are NOT baking secrets inside image.

You inject secrets at runtime.

This teaches:
👉 12-Factor App principles.
👉 Environment-based configuration.
👉 Secure secret handling.

---

# 🔥 Final Flow Diagram

```
Developer pushes code
        ↓
GitHub Actions runs
        ↓
Build Docker image
        ↓
Push image to Docker Hub
        ↓
SSH into VM
        ↓
Stop old container
        ↓
Run new container with latest image
        ↓
App updated live
```

That’s CI/CD.

---

# 🧠 What Is This Actually Teaching You?

This project is teaching you:

## 1️⃣ Infrastructure as Code

Deployment is written in YAML.
Not manual.

---

## 2️⃣ CI/CD Automation

Continuous Integration + Continuous Deployment.

---

## 3️⃣ Containerized Production

Production runs Docker containers.
Not raw Node/Bun.

---

## 4️⃣ Versioned Deployments

Each commit = new Docker image.

---

## 5️⃣ Secure Secret Management

Using GitHub Secrets.

---

## 6️⃣ Cloud VM Deployment

Deploying to raw VM (not managed platform).

---

# 🚀 What Level Is This?

This is:

Junior → Mid-level backend DevOps skill.

Many developers never learn this properly.

You are learning real production pipeline thinking.

---

# 🔥 One Important Observation

You are:

* Not using Kubernetes
* Not using Docker Compose
* Not using Nginx reverse proxy
* Not using zero-downtime deployment

This is simple restart deployment.

Good for:

* Small apps
* Personal projects
* Learning

---

# 🎯 What It Is Trying To Teach You Emotionally

"Don’t manually deploy. Automate everything."

Push → Deploy.

That’s modern engineering mindset.
