## ⚙️ OVERVIEW — CI/CD Flow

Here’s what your end goal looks like visually:

```
GitHub Repo (Node App)
      ↓  (Commit / Push)
GitHub Actions Workflow
      ↓
Docker Build (App)
      ↓
Push image → AWS ECR
      ↓
Update ECS service (new image version)
      ↓
Load Balancer (updated app)
```

---

## 🧱 STEP 1 — Create AWS Resources (if not done)

Make sure you already have:

* **ECR repo** (example: `node-app`)
* **ECS cluster** (example: `node-cluster`)
* **ECS service + task definition**
* **IAM user or role** with permissions to:

  * Push to ECR
  * Update ECS services

If you already deployed it manually, you’re good ✅.

---

## 🔑 STEP 2 — Create IAM User for GitHub Actions

Go to **AWS IAM Console** → **Users** → “Add User”
Give it a name like `
github-actions-deploy-for-node-app`.

Attach these policies:

* `AmazonEC2ContainerRegistryFullAccess`
* `AmazonECS_FullAccess`
* (Optionally restrict to your resources later)

Then generate **Access Key & Secret Key**.

Now, in your GitHub repo:

* Go to **Settings → Secrets → Actions**
* Add the following secrets:

| Secret Name             | Value                          |
| ----------------------- | ------------------------------ |
| `AWS_ACCESS_KEY_ID`     | (from IAM user)                |
| `AWS_SECRET_ACCESS_KEY` | (from IAM user)                |
| `AWS_ACCOUNT_ID`        | (Your AWS Acount ID)           |
| `AWS_REGION`            | `ap-south-1` or (Your Region)  |
| `ECR_REPOSITORY`        | (ECR Repo Name)                |
| `ECS_CLUSTER`           | (ECS Cluster Name)             |
| `ECS_SERVICE`           | (ECS Cluster Servive Name)     |

---

## ⚙️ STEP 3 — Create GitHub Actions Workflow

Inside your repo, create this file:

```
.github/workflows/deploy.yml
```

### 🧩 Full Example:

```yaml
name: 🚀 Deploy Node App to AWS ECS

on:
  push:
    branches: [ main ] # Auto-deploy when you push to main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout repository
      - name: 🧭 Checkout repository
        uses: actions/checkout@v4

      # Step 2: Configure AWS credentials (from GitHub Secrets)
      - name: 🔐 Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      # Step 3: Log in to Amazon ECR
      - name: 🔑 Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      # Step 4: Build, tag, and push Docker image to ECR
      - name: 🐳 Build, tag, and push Docker image
        id: build-image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: ${{ secrets.ECR_REPOSITORY }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          echo "Building Docker image..."
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

      # Step 5: Replace placeholders in ECS task definition
      - name: 🧩 Replace placeholders in ECS task definition
        run: |
          sed -i "s/{{ECR_REPOSITORY}}/${{ secrets.ECR_REPOSITORY }}/g" ecs-task-def.json
          sed -i "s/{{AWS_ACCOUNT_ID}}/${{ secrets.AWS_ACCOUNT_ID }}/g" ecs-task-def.json
          sed -i "s/{{AWS_REGION}}/${{ secrets.AWS_REGION }}/g" ecs-task-def.json

      # Step 6: Render new ECS task definition with new image
      - name: 🧩 Render new ECS task definition
        id: render-task-def
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: ecs-task-def.json
          container-name: ${{secrets.ECR_REPOSITORY}}
          image: ${{ steps.build-image.outputs.image }}

      # Step 7: Deploy updated task definition to ECS
      - name: 🚀 Deploy to Amazon ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: ${{ steps.render-task-def.outputs.task-definition }}
          service: ${{ secrets.ECS_SERVICE }}
          cluster: ${{ secrets.ECS_CLUSTER }}
          wait-for-service-stability: true
```

---

## 🗂️ STEP 4 — Task Definition File (for ECS)

Create a JSON file in your repo root:
`ecs-task-def.json`

Example:

```json
{
  "family": "{{ECR_REPOSITORY}}",
  "executionRoleArn": "arn:aws:iam::{{AWS_ACCOUNT_ID}}:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "{{ECR_REPOSITORY}}",
      "image": "{{AWS_ACCOUNT_ID}}.dkr.ecr.{{AWS_REGION}}.amazonaws.com/{{ECR_REPOSITORY}}:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/{{ECR_REPOSITORY}}",
          "awslogs-region": "{{AWS_REGION}}",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "essential": true
    }
  ],
  "cpu": "1024",
  "memory": "3072",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "runtimePlatform": {
    "cpuArchitecture": "X86_64",
    "operatingSystemFamily": "LINUX"
  }
}

```

> ⚠️ You can replace the `image` field with a placeholder — GitHub Action will override it when deploying.

---

## 🔁 STEP 5 — Test It

1. Commit all files (`.github/workflows/deploy.yml` and `ecs-task-def.json`)
2. Push to your `main` branch
3. Go to your repo → **Actions** tab → you’ll see a “Deploy to AWS ECS” job running

If successful:

* GitHub builds a new Docker image
* Pushes it to your ECR repo
* Updates ECS service → rolling update starts
* Load balancer URL (`test.niharheavrdevs.online`) now serves the new code 🎉

---

## 💡 Optional Improvement: Use Tags for Versioning

You can tag images by branch name or version:

```yaml
IMAGE_TAG: ${{ github.ref_name }}-${{ github.run_number }}
```

Then your image names will look like:

```
node-app:main-23
node-app:featureX-4
```

---

## 🚀 Final Result

After setup, your flow becomes:

> 💬 “I pushed code → GitHub Action ran → ECS auto-deployed → Load Balancer updated → done.”

No manual Docker commands ever again. 🧠✨
