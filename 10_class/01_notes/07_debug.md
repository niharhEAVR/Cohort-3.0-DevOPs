# This debug file is for the pm2 problem if the pm2 does not starts the apps then debug by using this file

### 🧩 What are these two files?

#### 1️⃣ `/var/log/cloud-init.log`

* **Purpose:** Main log file for the cloud-init service.
* **Contains:**

  * Step-by-step execution of the cloud-init process
  * Package installation, user-data script execution, errors, and debug info
* **Use case:** Check this if **your user-data script fails** or the instance didn’t start as expected.

#### 2️⃣ `/var/log/cloud-init-output.log`

* **Purpose:** Captures the **output of your user-data script** (the commands you put in Launch Template or user-data).
* **Contains:**

  * Stdout and stderr of your scripts
  * Success/failure messages from commands like `pm2 start` or `export PATH`
* **Use case:** Check this if your **app didn’t start automatically** or environment variables were not set.

---

### 🔹 How they differ

| File                    | What it tracks                    | When to check                                              |
| ----------------------- | --------------------------------- | ---------------------------------------------------------- |
| `cloud-init.log`        | cloud-init service process itself | Debug cloud-init failures, syntax errors, package installs |
| `cloud-init-output.log` | Output from user-data scripts     | Debug actual commands, PM2 start failures, path issues     |

---

### 🔹 Quick way to inspect

```bash
# View last 50 lines of cloud-init log
tail -n 50 /var/log/cloud-init.log

# View last 50 lines of user-data output
tail -n 50 /var/log/cloud-init-output.log
```

* If your PM2 app didn’t start on boot, usually **cloud-init-output.log** will show **command errors** like “bun: command not found” or PM2 issues.

---

💡 **Tip:** Always check `cloud-init-output.log` first for your launch template scripts, then `cloud-init.log` for deeper cloud-init internal errors.
