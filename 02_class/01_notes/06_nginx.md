```link
https://projects.100xdevs.com/tracks/g0AcDSPl74nk45ZZjRdU/aws-7
```

### Visit this link before reading the whole document, and understsnd the pictures first then relate it with texts


### **What is Nginx?**  
Nginx (pronounced "Engine-X") is a high-performance **web server**, **reverse proxy**, and **load balancer**. It is widely used for hosting websites, handling HTTP requests, and efficiently managing traffic.  

### **Problems Nginx Solves When Hosting a Website on AWS**
When you host a website on AWS (or any cloud platform), Nginx helps solve several challenges:

#### **1. Serving Static and Dynamic Content Efficiently**
   - Nginx can serve **static files** (HTML, CSS, JavaScript, images) directly without requiring a backend.
   - For **dynamic content**, it can forward requests to an application server like Node.js, Python, or PHP.

   ✅ **Solution:** Reduces load on backend servers and improves response times.

#### **2. Reverse Proxy for Backend Services**
   - Suppose your app is running on `localhost:8080`, but you want users to access it via `http://yourdomain.com/`.
   - Nginx acts as a **reverse proxy**, forwarding incoming requests to your backend.

   ✅ **Solution:** Users interact with `http://yourdomain.com`, while the backend remains hidden.

   ```nginx
   location / {
       proxy_pass http://localhost:8080;
   }
   ```

#### **3. Load Balancing**
   - If your app runs on multiple instances (`localhost:8080`, `localhost:8081`, etc.), Nginx can distribute incoming requests across them.

   ✅ **Solution:** Prevents any single instance from getting overloaded.

   ```nginx
   upstream backend_servers {
       server localhost:8080;
       server localhost:8081;
   }

   location / {
       proxy_pass http://backend_servers;
   }
   ```

#### **4. Handling SSL/TLS (HTTPS)**
   - AWS provides an **Elastic Load Balancer (ELB)** for SSL, but you can also set up **Let's Encrypt** with Nginx.

   ✅ **Solution:** Secure connections (HTTPS) for better security.

   ```nginx
   server {
       listen 443 ssl;
       server_name yourdomain.com;

       ssl_certificate /path/to/fullchain.pem;
       ssl_certificate_key /path/to/privkey.pem;

       location / {
           proxy_pass http://localhost:8080;
       }
   }
   ```

#### **5. Caching for Performance**
   - Nginx can cache responses from the backend, reducing database and server load.

   ✅ **Solution:** Faster load times and reduced backend processing.

   ```nginx
   location / {
       proxy_cache my_cache;
       proxy_pass http://localhost:8080;
   }
   ```

#### **6. Security and Rate Limiting**
   - Nginx can block bad requests, limit the number of requests per user, and prevent DDoS attacks.

   ✅ **Solution:** Protects your website from abuse.

   ```nginx
   limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

   location / {
       limit_req zone=one;
       proxy_pass http://localhost:8080;
   }
   ```

### **Conclusion**
Nginx is a powerful tool for deploying websites on AWS because it:
- Serves static and dynamic content efficiently.
- Acts as a **reverse proxy** for backend services.
- Distributes traffic using **load balancing**.
- Secures traffic with **SSL/TLS**.
- Improves **performance with caching**.
- Enhances **security with rate limiting**.

### Would you like help setting up Nginx on AWS? 🚀


### **Setting Up Nginx on AWS (Step-by-Step)**
Let's configure Nginx to serve your application on an **AWS EC2 instance**.

---

## **Step 1: Connect to Your AWS EC2 Instance**
1. Open a terminal and connect to your EC2 instance using SSH:
   ```bash
   ssh -i your-key.pem ubuntu@your-public-ip
   ```
   - Replace `your-key.pem` with your private key file.
   - Replace `ubuntu` with your EC2 username (e.g., `ec2-user` for Amazon Linux, `ubuntu` for Ubuntu).
   - Replace `your-public-ip` with your EC2 instance’s public IP.

---

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

## **Step 3: Configure Nginx as a Reverse Proxy**
### **Modify the Default Configuration**
Edit the Nginx configuration file:
(for some Linux distros):
```bash
sudo nano /etc/nginx/nginx.conf
```

Replace the existing content with this configuration:
```nginx
events {
    # Event directives...
}

http {
	server {
    listen 80;
    server_name _;  # This allows access from any IP or 
    server_name <YOUR_PUBLIC_IP>; # You can put your own aws ip address
    # Either any IP or your own aws ip, only one server_name should put over there not two

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
   http://your-public-ip
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


Yes, you can configure **multiple server blocks** in Nginx to serve different domains or IP-based configurations on the same AWS instance.

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
        server_name example.com www.example.com;

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
        server_name example2.com www.example2.com;

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