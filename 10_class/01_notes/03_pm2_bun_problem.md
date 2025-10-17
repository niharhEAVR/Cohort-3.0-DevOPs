### 🧠 Why `pm2` needs the Bun path

By default, **PM2 assumes you’re running Node.js** apps.

* When you run:

  ```bash
  pm2 start app.js
  ```

  PM2 automatically uses the Node.js binary (like `/usr/bin/node`) to run your app.

* But if your app is written in **TypeScript** and you’re using **Bun** (which is not Node),
  PM2 has **no idea** that it should use `bun` instead of `node`.

That’s why you must explicitly tell PM2 which interpreter to use:

```bash
pm2 start --interpreter $(which bun) /home/ubuntu/ASG/index.ts
```

or manually:

```bash
pm2 start --interpreter /usr/local/bin/bun /home/ubuntu/ASG/index.ts
```

---

### 🧩 What happens internally

PM2 basically does this:

* Spawns a process using the given **interpreter** (`bun`, `node`, `python`, etc.).
* Passes your script (`index.ts`) as an argument to it.

So your command above tells PM2:

> “Hey PM2, instead of using Node, please use this binary (Bun) to run my TypeScript app.”

---

### ✅ Tips for Bun + PM2 setup

1. **Use absolute paths** (like `/home/ubuntu/...`) — PM2 sometimes runs in a different environment than your shell.
2. You can also give it a nice name:

   ```bash
   pm2 start --interpreter $(which bun) /home/ubuntu/ASG/index.ts --name my-bun-app
   ```
3. **Save & autostart:**

   ```bash
   pm2 save
   pm2 startup
   ```
4. If Bun is globally available in `$PATH` for the `pm2` process (for example, installed via root or nvm equivalent), you can skip the `--interpreter` flag.
   But in many EC2 setups, your shell knows Bun’s path while PM2 (which runs as a background daemon) doesn’t.

---

### 🧪 Shortcut fix (optional)

You can symlink Bun into a standard path (so PM2 finds it automatically):

```bash
sudo ln -s $(which bun) /usr/bin/bun
```

Then you can just run:

```bash
pm2 start index.ts --interpreter bun
```

and it’ll work system-wide.



---
---
---





### 🧩 Context

When you use an **Auto Scaling Group (ASG)**, AWS will **launch new EC2 instances automatically**.

* These new instances start with a **fresh OS**.
* By default, nothing (Node, Bun, PM2, your app) is installed or running.

So, if you want your app to **start automatically on each new instance**, you need to **tell the instance what to do at boot**.

---

### 💡 Why your commands are in the Launch Template

1. **Set PATH for Node / Bun**

```bash
export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v22.20.0/bin
```

* Ensures the instance can **find Node and Bun binaries** installed via `nvm`.
* When scripts run at boot (via user-data or systemd), they may not have your usual shell PATH.
* Without this, `pm2` or `bun` commands could fail: `command not found`.

---

2. **Check PM2 status**

```bash
pm2 ls
```

* Optional, mostly for **debugging** — to see if any PM2 processes are running.
* Helps confirm PM2 is installed and ready.

---

3. **Start the app with PM2**

```bash
pm2 start --interpreter /home/ubuntu/.nvm/versions/node/v22.20.0/bin/bun /home/ubuntu/ASG/index.ts
```

* Launches your Bun app via PM2 **on the new instance**.
* Without this, the EC2 instance would be up but **your app would not run automatically**.
* Ensures **auto-scaling works seamlessly**: whenever ASG spins up a new instance, your app comes online automatically.

---

### 🧠 TL;DR

> We put these commands in the **Launch Template / User Data** so that **every new EC2 instance automatically knows how to start your app** using PM2 + Bun.
> Otherwise, you'd have to manually SSH into each instance and run the commands — which defeats the purpose of auto-scaling.
