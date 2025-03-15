### **Deployment Steps on AWS Instances**  

1. **Launch 2 AWS EC2 Instances**  
   - Choose an appropriate instance type (e.g., t2.micro for testing, t3.medium for production).  
   - Select an Ubuntu, Amazon Linux, or any preferred OS.  
   - Configure security groups to allow necessary ports (80, 443 for Nginx, 3000 for Next.js, etc.).  

2. **Install Required Software** on Both Instances  
   - Update system packages:  
     ```sh
     sudo apt update && sudo apt upgrade -y
     ```  
   - Install **Node.js**:  
     ```sh
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
     source ~/.bashrc
     nvm install --lts
     ```  

    - For future deployment:
      ```sh
        curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
        sudo apt install -y nodejs
      ```
 

   - Install **Nginx**:  
     ```sh
     sudo apt install -y nginx
     ```  
    - Install **pnpm**:  
      ```sh
      npm i pnpm -g
      ```  
    - Install **pm2**:  
      ```sh
      npm install pm2@latest -g
      ```  

3. **Clone the Monorepo to Both Servers**  
   - Clone the repository (replace with actual repo URL):  
     ```sh
     git clone https://github.com/Nihar-Debnath/testing
     cd testing
     ```  

4. **Start 3 Processes (Next.js, WebSocket, HTTP Server)**  
   - Install dependencies:  
     ```sh
     pnpm install
     ```  
    - Setup the database:  
      ```sh
      # Create two database in neondb, one is for staging and another one is for production
      cd packages/prisma
      vi .env # and paste the DATABASE_URL=""
      npx prisma migrate dev
      npx prisma generate
      ```  
    - Globally Build the monorepo:  
       ```sh
       pnpm build
      ```  
   - Start services using PM2 (process manager for Node.js):  
     ```bash
      cd testing/apps/http-server
      pm2 start npm --name "http-server" -- start
      pm2 save

      cd testing/apps/ws-server
      pm2 start npm --name "ws-server" -- start
      pm2 save

      cd testing/apps/web
      pm2 start npm --name "web" -- start
      pm2 save
     ```  

5. **Configure Domains in AWS Route 53**  
   - Go to bigrock.  
   - Create a records for each subdomain, pointing to the respective EC2 instance's public IP.  
      - Production:
        - `prod-http-server.niharheavrdevs.online`  
        - `prod-ws-server.niharheavrdevs.online`  
        - `prod-web.niharheavrdevs.online`  
     - Staging:  
       - `staging.http-server.niharheavrdevs.online`  
       - `staging.ws-server.niharheavrdevs.online`  
       - `staging.web.niharheavrdevs.online`  

6. **Configure Nginx as a Reverse Proxy**  
   - Open Nginx config file:  
     ```sh
     sudo vi /etc/nginx/nginx.conf
     ```  
      (`ESC` then `:wq` then `ENTER`)

---

   - Now add the Nginx configuration (adjust as needed):  
- ### for Staging:
```nginx
 
events {
    # Event directives...
}

http {
  server_names_hash_bucket_size 128;

     server {
    listen 80;
    server_name staging.web.niharheavrdevs.online;

        location / {
            proxy_pass http://localhost:3000;  
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
server {
    listen 80;
    server_name staging.http-server.niharheavrdevs.onlinene;

        location / {
            proxy_pass http://localhost:3001;  
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
server {
    listen 80;
    server_name staging.ws-server.niharheavrdevs.online;

        location / {
            proxy_pass http://localhost:3002;  
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

- ### for Production:
```nginx
 
events {
    # Event directives...
}

http {
  server_names_hash_bucket_size 128;

     server {
    listen 80;
    server_name devops-class-4-fe-server.niharheavrdevs.online;

        location / {
            proxy_pass http://localhost:3000;  
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
server {
    listen 80;
    server_name devops-class-4-http-server.niharheavrdevs.online;

        location / {
            proxy_pass http://localhost:3001;  
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
server {
    listen 80;
    server_name devops-class-4-ws-server.niharheavrdevs.online;

        location / {
            proxy_pass http://localhost:3002;  
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

   - Save and exit (`ESC`, then `:wq`, then `Enter`).  
   - Restart Nginx:  
     ```sh
     sudo nginx -s reload
     ```  

7. **Test Everything**  
   - Check if your application is accessible via the configured domains.  
   - Verify services using PM2:  
     ```sh
     pm2 list
     ```    
    - If there for an specific reason you want to stop the http-server or ws-server or web then:  
      ```sh
      pm2 delete http-server ws-server web # or
      pm2 delete all

      pm2 save --force
      ```    

Now, your application should be fully deployed on AWS! 🚀

Now Visit the `http://prod-http-server.niharheavrdevs.online` you will see your page