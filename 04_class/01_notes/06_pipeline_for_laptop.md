```yml
name: Deploy to production
on:
  push:
    branches: [ production ]

jobs:
  redeploy_everything:
    runs-on: ubuntu-latest
    name: Deploying everything to the final production
    steps:
         - run: |
            echo "${{ secrets.SSH_PRIVATE_KEY_LAPTOP }}" > ~/ssh_key
            chmod 600 ~/ssh_key  # Correct permissions

            mkdir -p ~/.ssh
            ssh-keyscan -H 15.206.117.182 >> ~/.ssh/known_hosts  # Automatically add the SSH key
            chmod 644 ~/.ssh/known_hosts

            ssh -i ~/ssh_key ubuntu@15.206.117.182 -t "
                export NVM_DIR=\$HOME/.nvm;
                source \$NVM_DIR/nvm.sh;
                nvm use 22.13.1;
                cd testing/;
                git pull origin production;
                npm install -g pnpm;
                pnpm install;
                pnpm run build;
                pm2 restart web;
                pm2 restart http-server;
                pm2 restart ws-server;
              "
```

Absolutely! Let's **break this down line by line**, **really deeply**, and also cover **what’s going on with the variables**, **where they are stored**, and **how you can access/use them**.

---

## 🚀 Summary of the Workflow

You're looking at a **GitHub Actions CI/CD workflow**. This script **automates deployment to a production server** whenever code is pushed to the `production` branch.

---

## 🧠 Understanding the File Structure

This file is probably named `.github/workflows/deploy.yml` inside your project repo.

---

## 🧾 Let's Break Down the File

### **1. Workflow Name and Trigger**

```yaml
name: Deploy to production
on:
  push:
    branches: [ production ]
```

- `name`: Just the name shown in the GitHub Actions UI.
- `on.push.branches`: This means the workflow runs **only when someone pushes to the `production` branch**.

---

### **2. Job Definition**

```yaml
jobs:
  redeploy_everything:
    runs-on: ubuntu-latest
    name: Deploying everything to the final production
```

- `jobs`: This YAML block defines the jobs that will run.
- `redeploy_everything`: The **ID** of the job.
- `runs-on: ubuntu-latest`: GitHub will spin up a **Linux VM** (Ubuntu) in the cloud to run this job.
- `name`: The name shown in GitHub Actions UI.

---

### **3. Steps (The Deployment Logic)**

```yaml
    steps:
         - run: |
            echo "${{ secrets.SSH_PRIVATE_KEY_LAPTOP }}" > ~/ssh_key
            chmod 600 ~/ssh_key
```

#### 🧠 What's happening here?

##### 🔐 `${{ secrets.SSH_PRIVATE_KEY_LAPTOP }}`:
- This is a **GitHub Actions Secret**.
- It holds your **private SSH key** that allows **secure login** to your server (usually a `.pem` or OpenSSH formatted key).

✅ **Stored Where?**
- Go to your repo → **Settings** → **Secrets and Variables** → **Actions**.
- There you'll find `SSH_PRIVATE_KEY_LAPTOP`.

✅ **Why is it stored there?**
- You never hardcode sensitive data like private keys in code. GitHub lets you store them securely in **encrypted secrets**.

✅ **How to access them?**
- In your GitHub Actions YAML, you access them with `secrets.<secret_name>`, wrapped in `${{ }}`.

##### 🔐 `echo ... > ~/ssh_key`:
- Saves the private key into a temporary file named `ssh_key`.

##### 🔐 `chmod 600 ~/ssh_key`:
- Sets file permissions so only the current user can read/write this key (required by SSH).

---

### **4. Prepare SSH to Connect to Remote Server**

```bash
mkdir -p ~/.ssh
ssh-keyscan -H 15.206.117.182 >> ~/.ssh/known_hosts
chmod 644 ~/.ssh/known_hosts
```

- `mkdir -p ~/.ssh`: Creates a `.ssh` folder if it doesn’t exist.
- `ssh-keyscan`: Adds the **host’s fingerprint** to known hosts (avoids “are you sure you want to continue connecting?” prompt).
- `chmod 644`: Normal permissions for `known_hosts`.


```bash
ssh-keyscan -H 15.206.117.182 >> ~/.ssh/known_hosts
```

## 🧠 What Does This Do?

This command **adds the remote server's SSH fingerprint to your known hosts file**, so SSH doesn’t ask:

> “Are you sure you want to continue connecting (yes/no)?”

---

### 🧩 Step-by-step Breakdown:

#### 🔹 `ssh-keyscan`

- This is a **command-line tool** that fetches the **public SSH host key** from a server.
- It does **not** log you in — it just talks to the server and says:
  > “Hey, can I know your identity (your fingerprint)?”

#### 🔹 `-H`

- This option **hashes** the hostname (like an IP or domain) in the output.
- It's a **security feature**, so your `known_hosts` file doesn’t easily expose which servers you're connecting to.

> (But even if you skip `-H`, it'll still work — just a bit less private.)

#### 🔹 `15.206.117.182`

- This is your **server’s IP address** — the machine you're connecting to.
- This is where you're deploying your app (via `ssh ubuntu@15.206.117.182` later).

#### 🔹 `>> ~/.ssh/known_hosts`

- This **appends** the server’s SSH fingerprint to the file called `known_hosts` in your `.ssh` directory.
- So next time you SSH, your system **already knows the identity of the server**, and doesn’t ask:

```
The authenticity of host '15.206.117.182 (15.206.117.182)' can't be established.
RSA key fingerprint is SHA256:abc123....
Are you sure you want to continue connecting (yes/no)?
```

This confirmation can **block your automation**, so you're solving it **in advance**.

---

### 💥 Why Is This Step Important?

When you SSH into a server **for the first time**, it asks:
> “Do you trust this server?”

If you don’t answer, **SSH will cancel** the connection — and your GitHub Action will fail.

`ssh-keyscan` avoids that by **preloading the trust**.

---

### 📁 What’s in `~/.ssh/known_hosts`?

It looks like this:

```
|1|+abc...==|Xyz...== ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAtVx...
```

This is a fingerprint of the **server’s public key**.

Every SSH server (like yours on `15.206.117.182`) has a public-private key pair that proves its identity — this is how your client knows:
> “Oh yeah, this is definitely my server. Not someone pretending to be it.”

---

### 💡 TL;DR Analogy

Think of it like this:

- `ssh-keyscan` = asking someone their name.
- `known_hosts` = your contacts list.
- Without this step = every time you meet someone new, you ask “Who are you?” and hesitate.
- With this step = they’re already in your contact list — you just say “Hey, welcome.”




---

### **5. Connect and Deploy to Remote Server**

```bash
ssh -i ~/ssh_key ubuntu@15.206.117.182 -t "
```

- SSH into the server as the `ubuntu` user using the `ssh_key` (you generated above).
- `-t`: Allocate a pseudo-terminal (so you can run commands interactively).

Now, inside the SSH session:

```bash
export NVM_DIR=\$HOME/.nvm;
source \$NVM_DIR/nvm.sh;
nvm use 22.13.1;
```

- Use `nvm` (Node Version Manager) to load and switch to Node.js version `22.13.1`.

```bash
cd testing/;
```

- Move into the project directory on the remote server.

```bash
git pull origin production;
```

- Pull the latest changes from the `production` branch.

```bash
npm install -g pnpm;
```

- Ensure `pnpm` (an alternative to `npm`) is installed globally.

```bash
pnpm install;
```

- Install all project dependencies defined in `pnpm-lock.yaml`.

```bash
pnpm run build;
```

- Build your production-ready code (like transpile TS, compile JSX, etc.).

```bash
pm2 restart web;
pm2 restart http-server;
pm2 restart ws-server;
```

- Restart all your running Node.js services managed by [PM2](https://pm2.keymetrics.io/), a production process manager:
  - `web`: maybe your main app
  - `http-server`: maybe static file server
  - `ws-server`: maybe your websocket server

---

## 🔒 Where Are These Variables Stored and Why?

| **Variable Name**                     | **Stored In**                                    | **Why It's Stored There**                                                      |
|--------------------------------------|--------------------------------------------------|---------------------------------------------------------------------------------|
| `secrets.SSH_PRIVATE_KEY_LAPTOP`     | GitHub repo → Settings → Secrets and Variables   | To keep your **private key safe**. Never commit keys in public repositories.    |
| `NVM_DIR`, `pnpm`, `pm2`             | Temporarily set during the SSH session           | To configure the environment correctly for your deployment.                    |
| Other local variables like `ssh_key` | Just temp files on the GitHub runner VM          | Used only for the current job, deleted after the run ends.                     |

---

## 💡 Extra Notes

- 💥 If someone pushes to `production`, this whole workflow runs automatically.
- 🔒 Secrets like `SSH_PRIVATE_KEY_LAPTOP` are **masked in logs** — you won’t see them exposed in GitHub Action logs.
- ☁️ You’re deploying to a remote server at IP `15.206.117.182` using **SSH + Git pull + pnpm + PM2**.

---

## 🛠 How to Add a Secret?

1. Go to your **GitHub repository**.
2. Click **Settings**.
3. Scroll to **Secrets and variables → Actions**.
4. Click **"New repository secret"**.
5. Name it something like `SSH_PRIVATE_KEY_LAPTOP`.
6. Paste your private key inside.

---

If you want, I can also help you generate a new SSH key pair, explain how to copy the public key to the server, or troubleshoot if something goes wrong during deployment. Just let me know!