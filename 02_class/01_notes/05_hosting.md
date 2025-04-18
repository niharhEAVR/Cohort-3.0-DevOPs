Here's a properly formatted and structured version of your instructions:  

---

## 🚀 AWS EC2 Setup & Running an Express App  

If you need additional guidance, check this link:  
🔗 [AWS EC2 Guide](https://projects.100xdevs.com/tracks/g0AcDSPl74nk45ZZjRdU/aws-4)  

If you don’t understand something from the link, follow the steps below.  

---

### 🛠️ **Step 1: Clone the GitHub Repository**  

Run the following command to clone the repository:  
```bash
git clone https://github.com/Nihar-Debnath/testing-2.git
```

---

### 🔄 **Step 2: Install NVM (Node Version Manager)**  

Run this command to download and install NVM:  
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```  

After installation, refresh the terminal:  
```bash
source ~/.bashrc
```

---

### 📦 **Step 3: Install Node.js (LTS Version)**  

Install the latest **LTS (Long-Term Support)** version of Node.js:  
```bash
nvm install --lts
```

---

### ✅ **Step 4: Verify Node.js Installation**  

Navigate into the cloned repository:  
```bash
cd testing-2
```

Check if Node.js and npm are installed correctly:  
```bash
node -v  
npm -v
```

If both commands return version numbers, Node.js and npm are successfully installed.

---

### 📥 **Step 5: Install Project Dependencies**  

Inside the repository, run:  
```bash
npm install
```

---

### 🚀 **Step 6: Start the Express Server**  

Run the following command to start the Express.js app:  
```bash
node index.js
```

Your Express server should now be running on your AWS EC2 instance! 🎉  

Let me know if you need further clarification. 🚀