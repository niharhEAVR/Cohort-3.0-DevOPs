There are many ways to get an SSL certificate — you can purchase one from providers like **AWS**, **GoDaddy**, and other domain registrars. However, for learning purposes, we’ll use a free SSL certificate from **Certbot**. Certbot automates the process of getting and installing a certificate from **Let’s Encrypt**.

---

## 🌐 **Step-by-Step Guide to Set Up Certbot with Nginx on an Ubuntu VM**
Here’s a simplified step-by-step process to set up an SSL certificate using Certbot on an Ubuntu machine running **Nginx**:

### ✅ **Step 1: SSH into Your VM**
1. Open your terminal and connect to your server using SSH:
```bash
ssh username@your-server-ip
```

---

### ✅ **Step 2: Install Certbot Using Snap**
1. Install Certbot using Snap:
```bash
sudo snap install --classic certbot
```

2. Create a symbolic link to make the `certbot` command available globally:
```bash
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

---

### ✅ **Step 3: Set Up SSL for Nginx**
1. Run the following command to obtain and install the SSL certificate for Nginx:
```bash
sudo certbot --nginx
```

2. Certbot will:
   - Ask for your email address (you can skip it if you want).  
   - List the available domains configured in Nginx.  
   - Ask which domain(s) you want to enable SSL for — select the number(s) from the list.  

3. Once you select the domain, Certbot will:
   - Automatically obtain the SSL certificate.
   - Update the Nginx configuration to use HTTPS.
   - Enable HTTP to HTTPS redirection.  

---

### ✅ **Step 4: Verify SSL Installation**
After the setup, you can check if the certificate is installed and working by visiting your website with **https://**.

You can also manually check the certificate status:
```bash
sudo certbot certificates
```

---

### ✅ **Step 5: Set Up Auto-Renewal (Optional) **
Certbot sets up automatic renewal by default using a systemd timer or cron job.  
You can test the auto-renewal with:
```bash
sudo certbot renew --dry-run
```

---

## ❌ **Step 6: Revoke or Delete Certificates (Optional)**
- To revoke a certificate:
```bash
sudo certbot revoke --cert-name example.com
```

- To delete a certificate:
```bash
sudo certbot delete --cert-name example.com
```

---

✅ After completion, your website should automatically redirect HTTP traffic to HTTPS!