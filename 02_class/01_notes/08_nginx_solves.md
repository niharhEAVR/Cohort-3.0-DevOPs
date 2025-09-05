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
