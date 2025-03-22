### Would you like a **hands-on guide** to setting this up in AWS? 🚀

## **🚀 Hands-on Guide: Setting Up a Scalable AWS Architecture**  
This guide will help you **deploy a scalable web application** on AWS using:  
✔ **EC2 (Virtual Server)**  
✔ **AMI (Amazon Machine Image)**  
✔ **Instance Template**  
✔ **Load Balancer**  
✔ **Target Group**  
✔ **Auto Scaling Group**  

---

## **🛠️ Prerequisites**
✅ AWS Account  
✅ Basic knowledge of AWS services  
✅ A simple **web app (e.g., a static HTML page or Node.js app)**  

---

## **🟢 Step 1: Launch an EC2 Instance**
1️⃣ Go to **AWS Console → EC2 → Instances → Launch Instance**  
2️⃣ Choose **Ubuntu 22.04** (or any OS you prefer).  
3️⃣ Select **t2.micro** (Free Tier eligible) as instance type.  
4️⃣ **Configure security group** to allow **HTTP (80), HTTPS (443), and SSH (22)**.  
5️⃣ Add **User Data (optional):**  
   ```bash
   #!/bin/bash
   apt update -y
   apt install -y nginx
   echo "<h1>Hello from EC2</h1>" > /var/www/html/index.html
   systemctl start nginx
   systemctl enable nginx
   ```
6️⃣ **Launch the instance** and connect via SSH to verify it works:  
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   ```

---

## **🟢 Step 2: Create an AMI (Image of the EC2)**
💡 **Why?** So we can launch identical EC2 instances later.  

1️⃣ Go to **EC2 → Instances**  
2️⃣ Select your running instance  
3️⃣ Click **Actions → Image and templates → Create Image**  
4️⃣ Give it a name (e.g., `MyWebServerAMI`)  
5️⃣ Click **Create Image**  

✅ After a few minutes, your AMI will be ready in **EC2 → AMIs**.  

---

## **🟢 Step 3: Create an Instance Template**
💡 **Why?** This allows AWS to launch multiple instances with the same setup.  

1️⃣ Go to **EC2 → Instance Templates → Create Instance Template**  
2️⃣ Choose the **AMI** you created earlier (`MyWebServerAMI`).  
3️⃣ Choose instance type (`t2.micro` for Free Tier).  
4️⃣ Select **Security Group** (Allow HTTP, HTTPS, SSH).  
5️⃣ Click **Create Instance Template**.  

✅ Now we have a template to launch EC2 instances automatically.

---

## **🟢 Step 4: Create a Load Balancer**
💡 **Why?** Distributes traffic evenly across EC2 instances.  

1️⃣ Go to **EC2 → Load Balancers → Create Load Balancer**  
2️⃣ Select **Application Load Balancer (ALB)**  
3️⃣ Choose **Internet-facing**  
4️⃣ Select **HTTP (80)** as the listener  
5️⃣ Choose **VPC & Availability Zones**  
6️⃣ **Create a new Target Group**:
   - Choose **Instance Target Type**
   - **Register your running EC2 instance**  
   - Click **Create Target Group**  
7️⃣ Go back to the Load Balancer setup and select the **Target Group**  
8️⃣ Click **Create Load Balancer**  

✅ Your Load Balancer is now set up! 🎉  

---

## **🟢 Step 5: Create an Auto Scaling Group**
💡 **Why?** Automatically scales instances up or down based on traffic.  

1️⃣ Go to **EC2 → Auto Scaling Groups → Create Auto Scaling Group**  
2️⃣ Give it a name (e.g., `MyWebServerASG`)  
3️⃣ Select the **Instance Template** you created earlier  
4️⃣ Attach it to the **Load Balancer’s Target Group**  
5️⃣ Set **Min: 0, Max: 5 Instances**  
6️⃣ Set **Scaling Policies** (e.g., add 1 instance if CPU > 60%, remove 1 if CPU < 20%)  
7️⃣ Click **Create Auto Scaling Group**  

✅ Now your system can **scale automatically!** 🚀  

---

## **🎯 Full Workflow Recap**
1️⃣ **Launch EC2 Instance** → Setup your web server  
2️⃣ **Create AMI** → Save it as a template  
3️⃣ **Create Instance Template** → Define how new instances should be launched  
4️⃣ **Create Load Balancer** → Distribute traffic across instances  
5️⃣ **Create Target Group** → Group of EC2 instances for the Load Balancer  
6️⃣ **Create Auto Scaling Group** → Adjusts instance count based on traffic  

---

## **🔍 Testing the Setup**
✅ **Check if Load Balancer works:**  
1️⃣ Find the **Load Balancer DNS name** (`EC2 → Load Balancers → Copy DNS Name`).  
2️⃣ Open it in a browser → You should see **"Hello from EC2"**.  

✅ **Test Auto Scaling:**  
1️⃣ Increase CPU load on an instance:  
   ```bash
   stress --cpu 2 --timeout 300
   ```
2️⃣ Check **Auto Scaling Group** → It should add more EC2 instances automatically!  

---

## **🎯 Summary**
🔹 **High Availability** – Load Balancer ensures uptime  
🔹 **Scalability** – Auto Scaling adds/removes instances  
🔹 **Cost Efficiency** – No over-provisioning of resources  



### IF not understand then read the next file (05_explanation.md)