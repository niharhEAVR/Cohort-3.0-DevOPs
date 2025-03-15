This GitHub Actions pipeline is designed to **deploy your application to a staging server** whenever you push changes to the `main` branch. Let me break it down **in a very detailed way** so that you understand every step.  

---

# **📌 Step-by-Step Breakdown of the GitHub Actions Pipeline**

### **1️⃣ Define the Workflow Name and Trigger**  
```yaml
name: Deploy to staging
on:
  push:
    branches: [ main ]
```
- `name: Deploy to staging` → This is just a **label** for your workflow, making it easy to identify.  
- `on: push` → This means the pipeline runs automatically when you push new code.  
- `branches: [ main ]` → It will only execute when code is pushed to the `main` branch.  

**🔹 Why is this needed?**  
👉 This ensures that deployment happens **only when the latest stable code is pushed to `main`**, preventing accidental deployments from feature branches.

---

### **2️⃣ Define the Job for Deployment**
```yaml
jobs:
  redeploy_everything:
    runs-on: ubuntu-latest
    name: Deploying everything to the staging cluster or in main branch
```
- `jobs:` → Defines a **job** that will run in the pipeline. A workflow can have multiple jobs.  
- `redeploy_everything:` → The name of the job, used internally in the workflow.  
- `runs-on: ubuntu-latest` → This tells GitHub to run the job on the **latest version of Ubuntu Linux**.  
  - **Why Ubuntu?** → Most deployment scripts are written for Linux servers, and Ubuntu is a popular choice.  

**🔹 Why is this needed?**  
👉 This ensures the deployment process runs on a fresh, clean Ubuntu environment every time.

---

### **3️⃣ Steps for Deployment**
```yaml
    steps:
         - run: |
```
- `steps:` → A list of steps that will be executed one by one.  
- `- run: |` → This means a **multi-line shell script** will be executed inside the Ubuntu runner.  

---

## **🔴 Understanding the Deployment Script (Inside `run: |`)**

## Before going there first open ubuntu terminal in your local machine and go `cd .ssh` then `cat Nihar-2.pem` and `cat known_hosts` then copy the texts inside those two file and add it to the `repo > Settings > Secrets and variables > Actions` as `SSH_PRIVATE_KEY` and `KNOWN_HOSTS`

either you will select the private key which download from aws or you can run this command `ssh-keygen -t rsa -b 4096` and and this private key then you have to replace the public key of the correxponding private key into the aws ec2 instances, otherwirse the machine cant give you access

Now, let’s break it down **line by line** 👇

### **4️⃣ Add SSH Private Key for Secure Server Access**
```yaml
            echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/ssh_key
            chmod 600 ~/ssh_key  # Correct permissions
```
- `echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/ssh_key`  
  - This **retrieves the private SSH key** from GitHub Secrets and writes it into a file (`~/ssh_key`).  
  - The SSH key is used to **authenticate** with the remote server (`52.66.6.56`).  
  - **Where does `secrets.SSH_PRIVATE_KEY` come from?**  
    - **Stored in GitHub Secrets** under `Settings > Secrets and variables > Actions`.  
    - **How is it created?**  
      - You generate an **SSH key pair** using `ssh-keygen -t rsa -b 4096`.
      - The **private key** is stored in GitHub Secrets as `SSH_PRIVATE_KEY`.
      - The **public key** is added to the server (`~/.ssh/authorized_keys` of the Ubuntu user).  

- `chmod 600 ~/ssh_key`  
  - This **sets the correct file permissions**, ensuring only the owner (runner) can read/write the key.  
  - SSH keys must have **strict permissions**; otherwise, SSH will reject them.

---

### **5️⃣ Set Up SSH Known Hosts**
```yaml
            mkdir -p ~/.ssh
            ssh-keyscan -H 52.66.6.56 >> ~/.ssh/known_hosts  # Automatically add the SSH key
            chmod 644 ~/.ssh/known_hosts
```
- `mkdir -p ~/.ssh`  
  - Creates the `.ssh` directory (if it doesn't exist).  
  - **Why?** → SSH config files (including `known_hosts`) must be inside `.ssh`.  

- **Stored in GitHub Secrets** under `Settings > Secrets and variables > Actions` as KNOWN_HOSTS. 

- `ssh-keyscan -H 52.66.6.56 >> ~/.ssh/known_hosts`  
  - **Scans the SSH fingerprint** of the remote server (`52.66.6.56`).  
  - Appends it to the `known_hosts` file.  
  - This prevents the **"Host key verification failed"** error when connecting via SSH.  

- `chmod 644 ~/.ssh/known_hosts`  
  - Sets correct permissions so the file can be read by anyone but modified only by the owner.  

**🔹 Where does `secrets.KNOWN_HOSTS` come from?**  
👉 It is **not used in this version** of the pipeline, but it can be stored in GitHub Secrets for extra security.  

---

### **6️⃣ SSH into the Server and Deploy**
```yaml
            ssh -i ~/ssh_key ubuntu@52.66.6.56 -t "
```
- `ssh -i ~/ssh_key ubuntu@52.66.6.56 -t`  
  - **Logs into the remote server (`52.66.6.56`) as the `ubuntu` user** using the private SSH key (`~/ssh_key`).  
  - `-t` → Forces a **pseudo-terminal** (to execute multiple commands).

---

### **7️⃣ Load NVM (Node Version Manager)**
```yaml
                export NVM_DIR=\$HOME/.nvm;
                source \$NVM_DIR/nvm.sh;
                nvm use 22.13.1;
```
- `export NVM_DIR=\$HOME/.nvm;`  
  - Sets the **environment variable** for NVM.  
- `source \$NVM_DIR/nvm.sh;`  
  - **Loads NVM** into the current session.  
- `nvm use 22.13.1;`  
  - Uses **Node.js version 22.13.1**.  
  - **Why?** → NVM is not automatically loaded in non-interactive SSH sessions.

---

### **8️⃣ Navigate to the Project Directory**
```yaml
                cd testing/;
```
- Moves into the project directory **on the remote server** (`testing/`).

---

### **9️⃣ Pull the Latest Code from GitHub**
```yaml
                git pull origin main;
```
- **Pulls the latest code** from the `main` branch of the GitHub repository.

---

### **🔟 Install Dependencies and Build the Project**
```yaml
                npm install -g pnpm;
                pnpm install;
                pnpm run build;
```
- Installs `pnpm` globally (`npm install -g pnpm`).
- Installs dependencies (`pnpm install`).
- Builds the project (`pnpm run build`).

---

### **1️⃣1️⃣ Restart the Servers Using PM2**
```yaml
                pm2 restart web;
                pm2 restart http-server;
                pm2 restart ws-server;
```
- Restarts **all three backend services** using `pm2` (Process Manager for Node.js).
- **Why?** → Ensures the latest code changes are reflected.

---

# **🛠️ Summary: What This Pipeline Does**
1. **Triggers** on a `git push` to `main`.
2. **Runs on** `ubuntu-latest` in a fresh GitHub Actions runner.
3. **Adds the SSH Key** from GitHub Secrets (`SSH_PRIVATE_KEY`).
4. **Adds the server to known hosts** (avoids verification issues).
5. **SSHs into the server (`52.66.6.56`)** using the key.
6. **Loads Node.js (via NVM)** and switches to the correct version.
7. **Navigates to the project directory** and pulls the latest code.
8. **Installs dependencies** and builds the project.
9. **Restarts the servers** using PM2.

---

# **🔍 Where Do `secrets.SSH_PRIVATE_KEY` and `secrets.KNOWN_HOSTS` Come From?**
These are **GitHub Secrets**, which store sensitive information **securely**.  
- **`SSH_PRIVATE_KEY`** → The **private SSH key** used to access the remote server.  
- **`KNOWN_HOSTS`** → Stores the **SSH fingerprint** of the remote server (optional).  

You can add them in **GitHub Repo → Settings → Secrets → Actions**.

---

# **🚀 Final Thoughts**
- This is a **secure and automated way** to deploy a project.  
- Uses **SSH and GitHub Secrets** to keep credentials safe.  
- Ensures that your **staging environment always has the latest code**.  
