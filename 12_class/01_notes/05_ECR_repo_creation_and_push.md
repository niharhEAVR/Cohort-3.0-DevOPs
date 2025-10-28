# 🧭 Step-by-Step Guide: Push a Containerized App to AWS ECR

---

## 🌐 Step 0: Prerequisites

Before starting, make sure you have:

✅ **AWS account**  
✅ **AWS CLI installed and configured**  
✅ **Docker installed**  
✅ **A containerized app (with Dockerfile)**  

If not done yet, configure the AWS CLI:

```bash
aws configure
```

You'll enter:
- Your AWS access key
- Secret key
- Default region (like `us-east-1`)
- Output format (you can leave it as `json`)

---

## 🛠️ Step 1: Create a Repository in ECR

### Option 1: Using AWS Console (GUI)

1. Go to [https://console.aws.amazon.com/](https://console.aws.amazon.com/)
2. In the **search bar**, type **ECR** and click **Elastic Container Registry**.
3. Click **“Get started”** or **“Create repository”**.
4. Choose **Private repository**.
5. Enter a name (e.g., `my-app`).
6. Image Tag settings : Choose `Mutable` if there will be aupdation coming in future or `Immutable` for no update
7. Encryption settings : AES-256
8. Leave settings as default (or customize as needed).
9. Click **Create repository**.

Now your ECR repo is ready.

> 📝 **Note the repo URI** — it looks like this:  
`123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app`

---

### Option 2: Using AWS CLI (Terminal)

```bash
aws ecr create-repository --repository-name my-app --region us-east-1
```

This will return a JSON with your repository details.

---

## 🐳 Step 2: Build Your Docker App (Locally)

Create a `Dockerfile` if you haven’t:

```Dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

Then in the terminal (where your Dockerfile is located):

```bash
docker build -t my-app .
```

You now have a Docker image named `my-app`.

---

## 🔐 Step 3: Login to ECR from Docker

- To know all the commands that how you can push the app into ecr then click on the `checkbox` of the private repo > and you will see a button `View Push Commands` > click and you will see all the commands for doing the operation.

- To push to ECR, you must authenticate Docker:

```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account Id>.dkr.ecr.<region>.amazonaws.com
```

Replace the **account ID and region** with your own.

You will see this

```sh
Login Succeeded
```


---

Before pushing the image, make sure the **ECR repository name** and the **local Docker image name** are the same.

* **ECR repository name** → `my-app`
* **Local Docker image name** → `my-app`

```sh
docker build -t my-app .
# i mean to say this
# if the name is wrong then rebuild that image with the repo name
```

✅ This ensures consistency and prevents push or tagging errors.


---

## 🏷️ Step 4: Tag the Docker Image

Docker needs the full ECR path to know where to push.

```bash
docker tag my-app:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
```

---

## 🚀 Step 5: Push the Image to ECR

Now push the image to your ECR repo:

```bash
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
```

You’ll see layers uploading. When it finishes, your image is now in AWS!

---

## 📦 What Just Happened?

Let’s recap the journey:

| Step | What Happened |
|------|---------------|
| 1 | Created a repository on ECR |
| 2 | Built a container locally |
| 3 | Logged Docker into AWS |
| 4 | Tagged the image with the ECR repo path |
| 5 | Pushed the image to AWS |

---

## ✅ Now What Can You Do?

- ✅ You can now use **ECS** or **Fargate** to run this container in the cloud.
- ✅ You can share this image across your AWS environment.
- ✅ You can automate deployments with CI/CD (e.g., GitHub Actions → ECR → ECS).

---

## 📘 BONUS: Want to Test It?

You can pull the image on any system that has Docker + AWS CLI:

```bash
docker pull 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest

docker run -d -p 3000:3000  381492183358.dkr.ecr.ap-south-1.amazonaws.com/my-app:latest
```
