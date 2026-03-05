## 🔥 What is a Firewall?

A **firewall** is a security system that **controls incoming and outgoing network traffic** based on rules.

In simple words:

> Firewall = Security guard for your server 🚪

It decides:

* Who can enter
* Who cannot enter
* What type of request is allowed
* What should be blocked

---

# 🧠 Imagine This (Real-Life Example)

Think about your EC2 server like your house.

Without firewall:

```
Anyone can knock.
Anyone can try the door.
Anyone can spam you.
```

With firewall:

```
Only people you allow can enter.
Suspicious people are blocked.
Too many knocks? → Blocked.
```

---

# 🌐 Where Firewalls Exist in Web Dev

There are different levels of firewalls:

---

## 1️⃣ Server-Level Firewall

Example: Security Groups in AWS

If you're using EC2, you already use firewall rules without realizing it.

For example:

* Allow port 80 (HTTP)
* Allow port 443 (HTTPS)
* Allow port 22 (SSH)
* Block everything else

That is firewall behavior.

---

## 2️⃣ Application-Level Firewall (WAF)

Example: Cloudflare

![Image](https://www.cloudflare.com/img/learning/ddos/glossary/waf/waf.png)


![Image](https://www.spanning.com/blog/sql-injection-attacks-web-based-application-security-part-4/SQL-injection-attack-example.png)


This type of firewall:

* Blocks SQL injection
* Blocks XSS attacks
* Blocks bots
* Blocks suspicious IPs
* Adds rate limiting

It inspects HTTP requests deeply.

---

# 🛡️ What Does a Firewall Check?

It can check:

* IP address
* Port number
* Protocol (TCP/UDP)
* Request headers
* Request body
* Too many requests (rate limiting)
* Malicious patterns

---

# 🧪 Example From Your Backend World

Let’s say your Node app has:

```
POST /login
GET /metrics
```

Firewall rules could be:

* Allow `/metrics` only from internal IP
* Block IP if 100 login attempts in 1 minute
* Allow only HTTPS traffic
* Block traffic from certain countries

Now your app becomes production-ready secure.

---

# 💣 What Happens Without Firewall?

* Bots hit your server
* Brute-force login attempts
* DDoS attack
* Unauthorized SSH attempts
* CPU spikes
* Server crash

Especially since you deploy on EC2 — firewall is NOT optional.

---

# 🎯 Types of Firewalls (Quick Overview)

| Type                     | Where Used          |
| ------------------------ | ------------------- |
| Network Firewall         | AWS Security Groups |
| Host Firewall            | Linux iptables      |
| Web Application Firewall | Cloudflare, AWS WAF |
| Hardware Firewall        | Corporate networks  |

---

# 🚀 In One Line

Firewall =
**A rule-based traffic filter that protects your server from unwanted or dangerous requests.**

---

Since you’re working with:

* EC2
* Nginx
* Monitoring stack

Next step for you would be:

* Learn Security Groups deeply
* Learn WAF
* Learn Rate Limiting
