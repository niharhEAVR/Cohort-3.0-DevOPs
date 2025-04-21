### 🧑‍💻 Today's Class: Deploying a Monorepo to a Virtual Machine (VM) Using Docker

---

### 🏁 Objective:

The goal of today's class is to understand how to **deploy a monorepo** to a virtual machine (VM) using **Docker** and explore the complete CI/CD workflow.

---

### 🪜 Step-by-Step Guide:

#### 1. **Clone the Starter Repository**

Start by cloning the following repository:

🔗 **GitHub Repo**:  
```bash
https://github.com/Nihar-Debnath/docker-ci-cd.git
```

#### 2. **Explore the Monorepo Structure**

- Begin by understanding the structure of the monorepo.
- Focus on the `apps/` and `packages/` folders to get an idea of how different parts of the project are organized.

#### 3. **Important Note: Don’t Run It Locally**

- **Do not try to run the monorepo locally** using Bun directly.
- The project has been modified in such a way that it **only runs with Docker**.
- So, shift your focus to Docker-based workflows.

#### 4. **Understand Docker Setup**

- Explore the `Dockerfile`s for each app/service inside the `docker/` directory.
- Review the `docker-compose.yml` file to understand how the services are coordinated and started together.

#### 5. **Set Up an External Database (NeonDB)**

- Since Docker containers have networking isolation issues, you **cannot use a local database**.
- Create an external PostgreSQL database on **[NeonDB](https://neon.tech)**.
- Add your connection string to the `.env` file inside `packages/db`.

#### 6. **Run the Project Using Docker**

You have two options:

- **Option 1: Run manually**  
  Use individual `docker build` and `docker run` commands for each service.
  
- **Option 2: Run all at once using Docker Compose**  
  Run:
  ```bash
  docker-compose --env-file ./packages/db/.env up --build
  ```

#### 7. **Explore GitHub Actions**

- Now move to the `.github/workflows/` directory.
- Understand how the GitHub Actions pipeline is set up.
- Visit the repository on GitHub and check what **secrets** are being used.

---

### 🚀 Deploy to a VM (AWS EC2)

#### 8. **Set Up an EC2 Instance**

- Go to [AWS EC2](https://aws.amazon.com/ec2/) and launch a virtual machine (preferably Ubuntu 24.04).
- SSH into your EC2 instance.

#### 9. **Install Docker on the EC2 Instance**

Use the following guide to install Docker:

🔗 **Docker Installation Guide**:  
[Install Docker on Ubuntu 24.04 - Vultr Docs](https://docs.vultr.com/how-to-install-docker-on-ubuntu-24-04)

#### 10. **Configure GitHub Actions for Your Own Repo**

- Fork or create your own repository.
- Add the required **secrets** in the GitHub repository settings.
- Update the GitHub Actions workflow files with your **own AWS IP address**.
- Push the code to your repo and check whether the **GitHub Actions pipeline runs successfully**.

---

### 🛠 Alternative Option

Instead of using the provided repo, you can:

- **Create your own monorepo** following a similar structure.
- Implement the same Docker + GitHub Actions deployment workflow.

💡 Need help? Refer to this Notion doc:

🔗 [Deploying a Monorepo to VMs – Notion Guide](https://petal-estimate-4e9.notion.site/Deploying-a-monorepo-to-VMs-19c7dfd10735808d9c2ae833fd2f2546)
