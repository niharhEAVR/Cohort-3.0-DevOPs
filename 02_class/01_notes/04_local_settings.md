## When you create a new **key pair** in AWS EC2, it will generate a `.pem` file (e.g., `my-key.pem`).  

This file is downloaded to your **local Downloads folder** (or the location where your browser saves downloads).  

## **🛠 What to Do with the `.pem` File?**  
- This file is your **private key** used to securely connect to your EC2 instance.  
- You need to **keep it safe**—AWS does **not** store it for you.  
- If lost, you **cannot** recover it and will lose access to your instance.  

## **🔑 How to Use the `.pem` File to Connect via SSH?**  

### **For Linux & macOS Users**
Run this command in your terminal:  
```bash
ssh -i /path/to/my-key.pem ubuntu@your-public-ip
```
Replace `/path/to/my-key.pem` with the actual file path.  

### **For Windows Users (Using PuTTY)**
1. Convert `.pem` to `.ppk` using **PuTTYgen**.  
2. Open **PuTTY**, enter your **Public IP**, and load the `.ppk` file.  
3. Click **Open** to connect.  

🚨 **Important:** Do not share this file—it grants full access to your instance!  


---

### Just after writing the command you will get a error like:

### 🔍 **Problem Explanation:**  
- The **error message** says:  
  ```
  Permissions 0644 for 'my_key.pem' are too open.
  It is required that your private key files are NOT accessible by others.
  This private key will be ignored.
  ```

The issue here is **"bad permissions"** on your private key file (`my_key.pem`).  

- **Why does this happen?**  
  - SSH requires that **private key files are not readable by anyone else**.  
  - Your file permissions (`0644`) make the file **readable by others**, which is a security risk.  
  - Because of this, SSH **ignores** the key and fails authentication (`Permission denied (publickey)`).

### ✅ **How to Fix It?**
Run the following command in your WSL terminal:  
```bash
chmod 600 my_key.pem # or use the down command
chmod 700 my_key.pem
```

- This command will not work on the windows, for that we need to transfer the my_key.pem file in to out WSL/home/nihar/.ssh folder

- In **WSL (Windows Subsystem for Linux)**, the Linux home directory (`/home/nihar`) is located inside WSL’s **virtual filesystem**, separate from Windows' filesystem (`C:\`).  

---

We need to move the AWS ssh private key (.pem file) into your **WSL Ubuntu `~/.ssh`** folder.

Here’s the step-by-step:

---

### 1. Locate your key in Windows

Let’s say your private key is:

```
C:\Users\<YourName>\Downloads\mykey.pem
```

### 2. Open your WSL terminal

Launch Ubuntu (WSL) from Start menu or Windows Terminal.

### 3. Make sure the `.ssh` folder exists

```bash
ls -al
```

if no `.ssh` folder presents then do these

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

### 4. Copy or Move the key from Windows → WSL

In WSL, Windows drives are mounted under `/mnt/`.
For example, your Downloads folder is usually at:

```
/mnt/c/Users/<YourName>/Downloads/
```

So run:

```bash
cp /mnt/c/Users/<YourName>/Downloads/mykey.pem  ~/.ssh/ # for copy only, original will remain in the windows download folder

mv /mnt/c/Users/<YourName>/Downloads/mykey.pem  ~/.ssh/ # no longer available in windows download folder
```

### 5. Fix file permissions (super important)

```bash
chmod 600 ~/.ssh/mykey.pem # or
chmod 700 ~/.ssh/mykey.pem
```

### 6. Use the key to connect

```bash
ssh -i ~/.ssh/mykey.pem <OS-or-User-name>@<SERVER_IP>
```
---

### Another simpler way is:

1. **Open Windows Explorer**
2. In the address bar, type:
   ```
   \\wsl$\Ubuntu\home\nihar
   ```
   (Replace `Ubuntu` with your actual WSL distribution name if different.)
3. Press **Enter**, and it will open your Linux home folder.

4. Then copy the my_token.pem from the download folder and paste the file in the ubuntu directory or in the .ssh folder of the ubuntu directory

5. it is the easiest, now need to write any `cp` or `mv` command except the permission command `(chmod)`

---
---
---


### **Understanding `chmod 600` and `chmod 700` in Linux File Permissions**

In Linux, **file permissions** are represented using a **three-digit octal number** (like `600`, `700`, etc.). These numbers determine **who can read, write, or execute a file**.

---

### **🔹 The Structure of File Permissions**
Each file in Linux has **three permission groups**:
1. **Owner** → The user who owns the file
2. **Group** → Users in the same group as the owner
3. **Others** → Everyone else

Each group can have three types of permissions:
| **Permission** | **Symbol** | **Octal Value** |
|--------------|-----------|--------------|
| Read  | `r` | 4 |
| Write | `w` | 2 |
| Execute | `x` | 1 |

**To calculate the octal value**, sum up the permission values for each group.


### **🔹 Understanding `600`**
When you set:
```bash
chmod 600 my_token.pem
```
It translates to:
- **Owner**: `rw-` (Read = 4, Write = 2 → **4+2 = 6**)
- **Group**: `---` (No permissions → **0**)
- **Others**: `---` (No permissions → **0**)

| **Owner (User)** | **Group** | **Others** |
|----------------|----------|-----------|
| **rw- (6)** | **--- (0)** | **--- (0)** |

🚀 **Use Case:** **For private files like SSH keys** (so only you can read and write the file).

---

### **🔹 Understanding `700`**
When you set:
```bash
chmod 700 my_token.pem
```
It translates to:
- **Owner**: `rwx` (Read = 4, Write = 2, Execute = 1 → **4+2+1 = 7**)
- **Group**: `---` (No permissions → **0**)
- **Others**: `---` (No permissions → **0**)

| **Owner (User)** | **Group** | **Others** |
|----------------|----------|-----------|
| **rwx (7)** | **--- (0)** | **--- (0)** |

🚀 **Use Case:** **For scripts or programs** where you need **execute permission**.

---

### **🔹 Summary Table**
| **Octal Value** | **Owner (User)** | **Group** | **Others** | **Common Use Case** |
|---------------|--------------|--------|--------|------------------|
| `600` | **rw-** | `---` | `---` | **SSH private keys** (Only you can read & write) |
| `700` | **rwx** | `---` | `---` | **Scripts & executables** (Only you can run them) |
| `644` | **rw-** | `r--` | `r--` | **Publicly readable files** (Like HTML files) |
| `755` | **rwx** | `r-x` | `r-x` | **Public scripts & executables** (Like `/usr/bin` programs) |

---

### **🔹 How to Check File Permissions?**
Run:
```bash
ls -l my_token.pem
```
- If `600`, output will look like:  
  ```
  -rw-------  1 user user  1700 Mar 12 23:30 my_token.pem
  ```
- If `700`, output will look like:  
  ```
  -rwx------  1 user user  1700 Mar 12 23:30 my_token.pem
  ```

---

### **✅ Final Recommendation for SSH Keys**
For SSH **private keys** (`.pem` files), always use:
```bash
chmod 600 my_token.pem
```
Because SSH requires **strict** security rules where only the owner can read/write the key.

Hope this helps! 🚀 Let me know if you have more questions. 😊


Then, try connecting again:  
```bash
ssh -i my_key.pem ubuntu@<ip-address>
```

# After the connection lets hosts an small express app on it, so lets read the 05_hosting.md