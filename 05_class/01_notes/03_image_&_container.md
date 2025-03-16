### **Docker Interview Perspective: Image vs. Container**  

| Feature      | Docker Image 🖼️ | Docker Container 📦 |
|-------------|-----------------|----------------------|
| **Definition** | A **blueprint/template** for creating containers. | A **running instance** of a Docker image. |
| **State** | **Static** (read-only). | **Dynamic** (read/write). |
| **Purpose** | Stores the application, dependencies, and configurations. | Runs the application using the image as a base. |
| **Persistence** | Does not change once built. | Changes/data inside a container do not persist after stopping (unless volumes are used). |
| **Creation** | Built using a `Dockerfile` and `docker build`. | Created from an image using `docker run`. |
| **Storage** | Stored in **Docker Registry** (e.g., Docker Hub, AWS ECR). | Runs on **Docker Engine** as an isolated process. |
| **Example Command** | `docker pull nginx` (downloads image). | `docker run -d nginx` (runs a container from the image). |

---

### **Key Difference 🔥**
- A **Docker image** is like a **class** in programming, while a **Docker container** is like an **object (instance) of that class**.  
- Images are **pre-built**, and containers are **live, running instances** based on those images.  

---

### **Example for Better Understanding**
#### **1️⃣ Docker Image**
Imagine a **recipe** for making a pizza.  
- The recipe has all the instructions and ingredients (like an image).  
- It does **not change** once written.

#### **2️⃣ Docker Container**
Now, you follow the recipe and **bake a pizza**.  
- The pizza is like a **container**, created from the recipe.  
- You can eat it, modify the toppings, or throw it away, but the **recipe remains unchanged**.

---

### **Common Interview Question**
❓ **What happens when you delete a container but not the image?**  
✅ The image remains in your system, and you can create new containers from it.  

❓ **Can multiple containers run from the same image?**  
✅ Yes! Multiple containers can be created from a single image, each running separately.

Would you like me to explain with actual Docker commands? 🚀