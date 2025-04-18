```link
https://projects.100xdevs.com/tracks/g0AcDSPl74nk45ZZjRdU/aws-7
```

### Visit this link before reading the whole document, and understsnd the pictures first then relate it with texts


### **What is Nginx?**  
Nginx (pronounced "Engine-X") is a high-performance **web server**, **reverse proxy**, and **load balancer**. It is widely used for hosting websites, handling HTTP requests, and efficiently managing traffic.  



## **Step 1: Connect to Your AWS EC2 Instance**
1. Open a terminal and connect to your EC2 instance using SSH:
   ```bash
   ssh -i your-key.pem ubuntu@your-public-ip
   ```
   - Replace `your-key.pem` with your private key file.
   - Replace `ubuntu` with your EC2 username (e.g., `ec2-user` for Amazon Linux, `ubuntu` for Ubuntu).
   - Replace `your-public-ip` with your EC2 instance’s public IP.


## **Step 2: Install Nginx**
Once connected, install Nginx using:

For **Ubuntu/Debian**:
```bash
sudo apt update && sudo apt install -y nginx
```

For **Amazon Linux**:
```bash
sudo amazon-linux-extras enable nginx1
sudo yum install -y nginx
```

Start Nginx and enable it to start on boot:
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

To check if Nginx is running:
```bash
sudo systemctl status nginx
```
You should see an **"active (running)"** status.

---
---

Sure! Here's a cleaner and corrected version of your instructions:

---

In the meantime, go to BigRock and log in:  
👉 [https://myorders.bigrock.in/dashboard](https://myorders.bigrock.in/dashboard)

1. Open the domain name you purchased.
2. Go to the **DNS Records** section.
3. Create a new **A Record**:
   - In the **Domain/Subdomain** field, enter: `test`
   - In the **IPv4 Address** field, enter your **AWS instance's public IP address**
   - Save the record.

4. After saving, open your terminal and run:
   ```bash
   ping test.niharheavrdevs.online
   ```
   - If it returns your AWS IP, the DNS record is set up correctly ✅

5. Now you can use `test.niharheavrdevs.online` in your Nginx configuration.

##### We are doing this because we don't want to expose our AWS IP address directly. So instead, we're using a DNS (domain name) to point to our server. Otherwise, you could directly use the AWS IP in the Nginx configuration.

---
---

## **Step 3: Configure Nginx as a Reverse Proxy**
### **Modify the Default Configuration**
Edit the Nginx configuration file:
(for some Linux distros):
```bash
sudo nano /etc/nginx/nginx.conf 
# or 
sudo vi /etc/nginx/nginx.conf
```

Replace the existing content with this configuration:
```nginx
events {
    # Event directives...
}

http {
	server {
    listen 80;
    server_name <YOUR_DOMAIN_NAME>; # put your sub-domain name here

        location / {
            proxy_pass http://localhost:8080;  # Change this if your app runs on a different port
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

Save the file (`CTRL + X`, then `Y`, then `Enter`).

---

## **Step 4: Restart Nginx**
After modifying the config, restart Nginx to apply changes:
```bash
sudo systemctl restart nginx # or 
sudo nginx -s reload
```

---

## **Step 6: Test the Setup**
1. Open a browser and go to:
   ```
   http://your-domain-name
   ```
   - If everything is working, you should see either **your application or the Nginx welcome page**.

2. If your app is running on port **8080**, make sure it’s active:
   ```bash
   sudo netstat -tulnp | grep 8080
   ```
   If nothing is listening on port 8080, start your app.


## **Done! 🎉**
Now, your app is accessible via Nginx on AWS. 🚀  
Let me know if you face any issues!



---
---
---


For configure **multiple server blocks** in Nginx to serve different domains or IP-based configurations on the same AWS instance.

### **Example: Multiple Domains on the Same Nginx Server**
If you want to host multiple domains (e.g., `example.com` and `example2.com`), you can create **separate `server` blocks** like this:

```nginx
events {
    # Event directives...
}

http {
    # Server block for example.com
    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://localhost:8080;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }

    # Server block for example2.com
    server {
        listen 80;
        server_name example2.com;

        location / {
            proxy_pass http://localhost:9090; # Different backend service
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```
### **How This Works**
- If a request comes for `example.com`, it is **proxied to `localhost:8080`**.
- If a request comes for `example2.com`, it is **proxied to `localhost:9090`**.
- Both websites run independently, using the same Nginx server.

---

### **Example: One Domain + One Public IP Server**
If you want to serve **one domain and one public IP** separately, you can do:

```nginx
events {
    # Event directives...
}

http {
    # Server block for AWS public IP
    server {
        listen 80;
        server_name <YOUR_PUBLIC_IP>;

        location / {
            proxy_pass http://localhost:8080;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }

    # Server block for a domain
    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://localhost:9090; # A different backend
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### **Key Takeaways**
✔ You can have multiple `server` blocks for **different domains or IPs**.  
✔ Each server block can **serve a different backend service** (e.g., `localhost:8080` and `localhost:9090`).  
✔ Make sure your **DNS settings** (or `/etc/hosts` file for local testing) point the domain to your AWS public IP.