### To start or deploy any app we need to create an instance first in AWS 

for that we need an EC2 (Elastic Compute Version 2) for that click on the launch instance button

```link
https://projects.100xdevs.com/tracks/g0AcDSPl74nk45ZZjRdU/aws-3
```

goto this specific link, you will understand better.

give a name, select an OS then you will need know these stuffs thens selects:


### **Understanding "Select Size" in EC2 Instances & Key Pairs**

#### **1. Instance Size (Instance Type)**
- When launching an **EC2 instance**, you must **select the instance size**, which refers to the **compute power, memory (RAM), and network performance** of the instance.
- Instance sizes are categorized under **Instance Types** (e.g., `t2.micro`, `t2.small`, `t3.medium`, etc.).
- The size you choose impacts **performance and cost**.

✅ **Example:**  
- `t2.micro` → 1 vCPU, 1 GB RAM (Free Tier eligible)  
- `t2.small` → 1 vCPU, 2 GB RAM  
- `t3.medium` → 2 vCPUs, 4 GB RAM  
- `m5.large` → 2 vCPUs, 8 GB RAM (higher performance)  


#### **2. Key Pair Selection**
- A **key pair** (SSH key) is required to securely connect to the EC2 instance.
- AWS does **not** provide a default password for instances, so you must use a **private key (`.pem` file)** to log in via SSH.

✅ **How it Works:**  
- When launching an EC2 instance, you are asked to **create or select a key pair**.  
- If you don’t have one, create a **new key pair** and download the `.pem` file.  
- When connecting via SSH, use:
  ```bash
  ssh -i your-key.pem ec2-user@your-public-ip
  ```


### **In Summary**
- **"Select size" in EC2** refers to choosing the **instance type** (CPU, RAM, performance).  
- **Key pair** is required for SSH access and must be securely stored.  


---
---
---


### **Understanding Network Settings in EC2 Instances**
Network settings determine how your EC2 instance connects to the internet, other AWS services, and your local machine. Before launching an instance, it's crucial to configure these settings correctly to ensure security and accessibility.

---

## **1️⃣ Key Components of EC2 Network Settings**
### **1.1 VPC (Virtual Private Cloud)**
- The VPC is like a private network inside AWS where your instance will run.
- AWS provides a **default VPC**, but you can create custom VPCs for better security and segmentation.

**✅ What to do?**  
- If you're a beginner, use the **default VPC** unless you have a specific reason to create a new one.

---

### **1.2 Subnet**
- A subnet is a smaller network inside the VPC.
- Instances in different subnets can have different levels of access to the internet.

**✅ What to do?**  
- Choose a **public subnet** if your instance needs to be accessible from the internet.  
- Choose a **private subnet** if your instance should only communicate within AWS.

---

### **1.3 Auto-assign Public IP**
- Determines if your instance gets a **public IPv4 address** for internet access.

**✅ What to do?**  
- **Enable Public IP** if you need to SSH into the instance from your local computer.  
- **Disable Public IP** if this instance is only meant for internal AWS communication.

---

### **1.4 Security Groups (Firewall Rules)**
- Security groups define what **traffic is allowed** to and from your instance.
- Acts as a **firewall** to control **incoming (inbound) and outgoing (outbound) traffic**.

**✅ What to change?**
1. **For SSH Access (Securely Connect via Terminal)**
   - Add an **inbound rule**:  
     - **Type:** SSH  
     - **Protocol:** TCP  
     - **Port:** 22  
     - **Source:**  
       - **Your IP** (Recommended, for security)  
       - `0.0.0.0/0` (Not secure, allows SSH from anywhere)

2. **For Hosting a Web App**
   - Add rules for HTTP and HTTPS:
     - **Type:** HTTP, Port 80 (for websites)
     - **Type:** HTTPS, Port 443 (for secure websites)

---

### **1.5 Elastic IP (Optional)**
- AWS **releases your public IP** when you **stop the instance** unless you attach an **Elastic IP**.
- Elastic IP is a **static** (fixed) public IP that does not change.

**✅ What to do?**  
- If you **want a permanent IP** (e.g., hosting a server), allocate and assign an **Elastic IP**.  
- If using a temporary instance, you don’t need an Elastic IP.

---

### **2️⃣ What You Should Change Before Launching**
| Setting                 | Recommended Configuration |
|-------------------------|--------------------------|
| **VPC** | Default (unless you set up a custom VPC) |
| **Subnet** | Public subnet (for internet access) |
| **Auto-assign Public IP** | Enable (for SSH access) |
| **Security Group (Inbound Rules)** | Allow SSH (Port 22) only from your IP, allow HTTP/HTTPS if hosting a web app |
| **Elastic IP** | Optional (for fixed public IP) |

---

### **3️⃣ Summary**
- **Security first** → Avoid `0.0.0.0/0` for SSH; allow only **your IP**.
- **Enable Public IP** if you need **internet access**.
- **Security Group rules** should be configured **based on the use case** (SSH, HTTP, HTTPS).
- **Elastic IP** is useful if you want a **fixed** IP.


---
---
---


### **🔒 Understanding Security Groups in AWS EC2**  

A **Security Group (SG)** in AWS acts as a **firewall** for your EC2 instance, controlling **inbound (incoming) and outbound (outgoing) traffic**. Security groups determine **who can access your instance** and **which services can communicate**.

---

## **1️⃣ Key Features of Security Groups**
✅ **Instance-Level Firewall** → Security groups apply to **EC2 instances**, not the entire network.  
✅ **Stateful** → If an inbound request is allowed, the response is **automatically** allowed.  
✅ **Deny by Default** → Everything is **blocked by default**, and you must **explicitly allow** access.  
✅ **Multiple Security Groups** → You can attach multiple security groups to an instance.  
✅ **Rules Apply Instantly** → Changes take effect **immediately** without rebooting the instance.  

---

## **2️⃣ Security Group Rules**
### **(A) Inbound Rules (Incoming Traffic)**
Controls **who** and **what services** can access your EC2 instance.  

| Rule | Protocol | Port Range | Source | Use Case |
|------|---------|------------|--------|----------|
| SSH | TCP | 22 | Your IP (e.g., `192.168.1.1/32`) | Secure access via terminal |
| HTTP | TCP | 80 | `0.0.0.0/0` | Allow everyone to access your website |
| HTTPS | TCP | 443 | `0.0.0.0/0` | Secure website access |
| Custom TCP | TCP | 3000 | `0.0.0.0/0` | Required if running a Node.js app |
| MySQL/Aurora | TCP | 3306 | Your IP | Database access (Never open to `0.0.0.0/0`) |
| MongoDB | TCP | 27017 | Your IP | MongoDB database access |

⚠️ **Important Security Tip:**  
- **Never allow SSH (port 22) from `0.0.0.0/0`**, as it makes your instance vulnerable to hacking.  
- Instead, use **your IP** (e.g., `123.45.67.89/32`).  

---

### **(B) Outbound Rules (Outgoing Traffic)**
Controls **what your instance can access** outside itself.  
By default, **all outbound traffic is allowed**. This means your EC2 instance can connect to the internet, databases, APIs, etc.

| Rule | Protocol | Port Range | Destination | Use Case |
|------|---------|------------|------------|----------|
| Allow All | All | All | `0.0.0.0/0` | Default rule (Allows instance to make any request) |
| Custom TCP | TCP | 5432 | RDS database | PostgreSQL access |
| Custom UDP | UDP | 1194 | VPN server | Connecting to a VPN |

💡 **In most cases, you don’t need to change outbound rules unless restricting traffic for security reasons.**  

---

## **3️⃣ Example Security Group Configurations**
### **🔹 Example 1: Secure EC2 Instance for SSH and Web Hosting**
| Type | Protocol | Port | Source |
|------|---------|------|--------|
| SSH | TCP | 22 | Your IP (e.g., `123.45.67.89/32`) |
| HTTP | TCP | 80 | `0.0.0.0/0` |
| HTTPS | TCP | 443 | `0.0.0.0/0` |

### **🔹 Example 2: EC2 Running a Node.js App**
| Type | Protocol | Port | Source |
|------|---------|------|--------|
| SSH | TCP | 22 | Your IP |
| HTTP | TCP | 80 | `0.0.0.0/0` |
| HTTPS | TCP | 443 | `0.0.0.0/0` |
| Custom TCP | TCP | 3000 | `0.0.0.0/0` |

### **🔹 Example 3: EC2 with a Private Database**
| Type | Protocol | Port | Source |
|------|---------|------|--------|
| SSH | TCP | 22 | Your IP |
| MySQL/Aurora | TCP | 3306 | Your IP |
| Custom TCP | TCP | 27017 | Your IP |

---

## **4️⃣ How to Configure Security Groups in AWS EC2**
### **(A) While Launching an EC2 Instance**
1. Go to **EC2 Dashboard** → **Launch Instance**  
2. Under **Network settings**, find **Security Group**  
3. Choose:
   - **Create a new security group** OR
   - **Select an existing security group**  
4. Add necessary **Inbound rules** for your application.  
5. Click **Launch**  

### **(B) After Launching an EC2 Instance**
1. Go to **EC2 Dashboard**  
2. Select your **running instance**  
3. Navigate to the **Security tab**  
4. Click **Security Groups** → Edit Inbound Rules  
5. **Add/Delete/Edit** rules as needed  
6. Save changes (takes effect immediately)  

---

## **5️⃣ Best Practices for Security Groups**
✅ **Use the least privilege principle** → Only allow necessary ports.  
✅ **Restrict SSH to your IP** → Avoid `0.0.0.0/0` for security.  
✅ **Monitor and update rules regularly** → Remove unnecessary rules.  
✅ **Use separate security groups** for different instances (e.g., Web, Database).  
✅ **Use VPC Security Groups for internal communication** (instead of public IPs).  

---

## **6️⃣ Final Thoughts**
Security groups are crucial for **controlling access** to your EC2 instance.  
By carefully setting **inbound rules**, you can **secure your instance** and **allow only necessary traffic**.


---
---
---

## **🔒 Step-by-Step Guide: Setting Up a Security Group in AWS EC2**  

This guide will help you **create, configure, and attach a security group** to an EC2 instance.

---

## **1️⃣ Creating a New Security Group**
Follow these steps to **create a security group** before launching your EC2 instance.  

### **Step 1: Open the Security Groups Page**  
1. Go to **AWS Management Console**  
2. Navigate to **EC2 Dashboard**  
3. On the left menu, click **Security Groups**  
4. Click the **Create Security Group** button  

---

### **Step 2: Define the Security Group**  
1. **Security group name** → Enter a descriptive name (e.g., `my-web-server-sg`)  
2. **Description** → Add a description (e.g., "Security group for web application")  
3. **VPC** → Select the **default VPC** (or your custom VPC if applicable)  

---

### **Step 3: Add Inbound Rules**  
Inbound rules define **who can access your instance**.  

#### **✅ Allow SSH (Only Your IP)**  
- **Type:** SSH  
- **Protocol:** TCP  
- **Port Range:** 22  
- **Source:** **My IP** (Recommended)  
  - If you need temporary public access, use `0.0.0.0/0` (⚠️ Not secure)  

#### **✅ Allow HTTP (Website Traffic)**  
- **Type:** HTTP  
- **Protocol:** TCP  
- **Port Range:** 80  
- **Source:** `0.0.0.0/0` (Allows all users to access the website)  

#### **✅ Allow HTTPS (Secure Website Traffic)**  
- **Type:** HTTPS  
- **Protocol:** TCP  
- **Port Range:** 443  
- **Source:** `0.0.0.0/0`  

#### **✅ Allow Custom Application Port (e.g., Node.js on port 3000)**  
- **Type:** Custom TCP  
- **Protocol:** TCP  
- **Port Range:** 3000  
- **Source:** `0.0.0.0/0`  

🔹 **If using a database, restrict access to only your IP**  
- **MySQL (Port 3306)** → Only allow your IP  
- **MongoDB (Port 27017)** → Only allow your IP  

---

### **Step 4: Configure Outbound Rules (Optional)**
By default, **all outbound traffic is allowed**. You usually don’t need to change this unless you want to restrict outgoing requests.  

---

### **Step 5: Review and Create**  
1. **Double-check all inbound rules**  
2. Click **Create Security Group**  
3. Your security group is now ready! 🎉  

---

## **2️⃣ Attach the Security Group to an EC2 Instance**
Now, you need to **attach the security group** to your EC2 instance.  

### **🔹 If Launching a New Instance**
1. Go to **EC2 Dashboard**  
2. Click **Launch Instance**  
3. Under **Network Settings**, choose:
   - **Select an existing security group** → Pick the one you just created  
   - **Or create a new security group**  

### **🔹 If Instance is Already Running**
1. Go to **EC2 Dashboard**  
2. Select your **running instance**  
3. Click **Actions** → **Security** → **Change Security Groups**  
4. Select your **new security group**  
5. Click **Save**  

✅ **Done! Your EC2 instance is now protected with your custom security group.** 🎯  

---

## **3️⃣ Best Practices**
✔ **Always restrict SSH to your IP (`/32`)**  
✔ **Never allow database access (`3306`, `27017`) from `0.0.0.0/0`**  
✔ **Use separate security groups for different services (e.g., Web, DB)**  
✔ **Monitor and update rules regularly**  



# Now click on the Launch Instance button for creating the instance
# Now read the 04_local_settings.md for locally setting up the instance with the computer