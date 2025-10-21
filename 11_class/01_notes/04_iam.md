## What is IAM in AWS?

**IAM = Identity and Access Management**

It is a **security service in AWS** that **controls who can access what** in your AWS account.

Think of it like:

* **Login system + Permissions system** for your AWS resources.
* Just like in a company, **not everyone gets access to everything**.

---

### Why is IAM needed?

Without IAM, **anyone with your AWS login could destroy everything** — delete servers, access databases, leak stored data, etc.

So AWS gives a very powerful tool called **IAM**, to let you **securely control access**.

---

## IAM Main Components (Remember these 4 words only!)

| Component  | Meaning                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| **User**   | A person or program that needs access (e.g., you, your app)                                              |
| **Group**  | A collection of Users (e.g., Admins, Developers, Interns)                                                |
| **Role**   | A temporary permission identity (mostly used by EC2, Lambda, backend services)                           |
| **Policy** | A document that **defines permission** → what is allowed or denied (“Can this person start EC2? Yes/No”) |

---

### Example to Understand

**Imagine you are the owner of a company:**

* You (root user) can do everything.
* You create **IAM Users**:

  * Developer → Can start EC2, write code
  * Finance Team → Can check billing, not EC2
* You assign **Policies** like:
  ✅ “Allow EC2 only”
  ❌ “Deny S3 delete”
* If an EC2 instance (your server) needs to access S3 automatically →
  You **attach an IAM Role** to EC2 instance, so it gets temporary permissions.

---

## In One Line:

**IAM is how AWS controls security — it decides WHO can do WHAT inside your AWS account.**
