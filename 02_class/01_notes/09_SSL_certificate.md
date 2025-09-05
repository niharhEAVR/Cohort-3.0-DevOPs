### Of coourse after doing all of the setups we do need help with setting up **SSL certificates (HTTPS) for each domain** 🚀

### **Setting Up SSL (HTTPS) for Multiple Domains in Nginx on AWS**  

To secure your websites with **SSL certificates (HTTPS)**, we will use **Let's Encrypt** (a free SSL provider) and **Certbot** to automate the process.  

---

## **🔹 Step 1: Install Certbot**  
First, connect to your AWS EC2 instance using SSH:
```bash
ssh -i your-key.pem ubuntu@your-public-ip
```
Then, install Certbot and the Nginx plugin:  

For **Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

For **Amazon Linux**:
```bash
sudo yum install -y certbot python3-certbot-nginx
```

---

## **🔹 Step 2: Ensure Your Domains Point to Your AWS Public IP**
Before proceeding, make sure:  
✅ Your domain (e.g., `example.com`, `example2.com`) is pointing to your AWS **Elastic IP** (use AWS Route 53 or your domain provider's DNS settings).  
✅ You can check by running:
```bash
nslookup example.com
```
If it shows your AWS public IP, you're good to go.

---

## **🔹 Step 3: Request SSL Certificates**
Run the following command for your domains:  
```bash
sudo certbot --nginx -d example.com -d www.example.com -d example2.com -d www.example2.com
```
- Certbot will automatically detect your Nginx configuration.  
- It will prompt you to provide an **email** for notifications.  
- Accept the **terms and conditions**.  
- Choose **whether to redirect HTTP → HTTPS** (select `2` for automatic redirection).  

---

## **🔹 Step 4: Verify SSL is Installed**  
Once the process is complete, Certbot will automatically update your Nginx configuration to use **HTTPS**. You can check it by running:
```bash
sudo nginx -t
```
If the configuration is OK, restart Nginx:
```bash
sudo systemctl restart nginx
```

---

## **🔹 Step 5: Automate SSL Renewal**
Let's Encrypt certificates expire every 90 days, so you need to renew them automatically.  
Run the following command to test automatic renewal:
```bash
sudo certbot renew --dry-run
```
If no errors occur, set up a **cron job** to renew SSL automatically:
```bash
sudo crontab -e
```
Add this line:
```bash
0 0 * * * certbot renew --quiet && systemctl reload nginx
```
This checks and renews the SSL certificate **every day at midnight**.

---

## **🔹 Step 6: Final Nginx Configuration with SSL**
If you want to manually check your Nginx SSL configuration, it should look something like this:

```nginx
events {
    # Event directives...
}

http {
    # HTTPS server for example.com
    server {
        listen 443 ssl;
        server_name example.com www.example.com;

        ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

        location / {
            proxy_pass http://localhost:8080;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }

    # HTTPS server for example2.com
    server {
        listen 443 ssl;
        server_name example2.com www.example2.com;

        ssl_certificate /etc/letsencrypt/live/example2.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/example2.com/privkey.pem;

        location / {
            proxy_pass http://localhost:9090;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name example.com www.example.com example2.com www.example2.com;
        return 301 https://$host$request_uri;
    }
}
```

---

## **🎉 Done!**
Now, both `example.com` and `example2.com` are **secured with HTTPS**! 🚀  

### **✅ Next Steps**
- Test your SSL by visiting `https://example.com` and `https://example2.com`.
- Run an **SSL check** using: [SSL Labs Test](https://www.ssllabs.com/ssltest/).
- Make sure HTTP requests automatically redirect to HTTPS.
