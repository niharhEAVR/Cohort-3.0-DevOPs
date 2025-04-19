To install **psql** (PostgreSQL client) on Windows, follow these steps:

---

### ✅ **Step-by-Step Guide to Install `psql` on Windows**

#### **Full PostgreSQL Installation (Recommended)**
This includes `psql`, PostgreSQL server, pgAdmin, and other tools.

1. **Download Installer**  
   Go to the official PostgreSQL site:  
   👉 [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)

2. **Choose Your Version**  
   Click on the *Download the installer* link (provided by **EDB**).

3. **Run the Installer**  
   Follow the setup wizard:
   - Choose installation directory
   - Set password for the **postgres** user
   - Make this port otherwise you will get problem in future `65432`
   - Select components (make sure **Command Line Tools** is checked)


---

### ✅ **What Each Component Does:**

1. **PostgreSQL Server**  
   - 💡 This is the actual **database server**.  
   - ✅ **Needed** if you want to **host** databases locally and run SQL commands using `psql`.

2. **pgAdmin 4**  
   - This is a **GUI tool** to manage PostgreSQL visually.  
   - ❌ Not needed if you prefer using `psql` (command line only).  
   - ✅ Keep it if you want a friendly interface to browse tables, run queries, etc.

3. **Stack Builder**  
   - It's used to install **optional add-ons**, like PostGIS, FDWs, etc.  
   - ❌ **Usually not needed** for basic use or development.

4. **Command Line Tools**  
   - ✅ This includes **`psql`**, the main CLI tool you want.

### 🔍 **So, what should you select?**

If you only want `psql` and a working database server:
- ✅ PostgreSQL Server
- ✅ Command Line Tools
- ❌ pgAdmin 4 (optional)
- ❌ Stack Builder

---



4. **Finish Installation**  
   Once installed, you can open **psql** from:
   - Windows Start Menu → *SQL Shell (psql)*  
   - Or from **Command Prompt** / **PowerShell** by typing `psql`

> ⚠️ If `psql` isn't recognized in CMD, you need to **add it to the PATH manually**. by going on the enviromental variable.

Click Environment Variables
Under System Variables, select Path → Edit → New
Add the full path to the extracted bin folder (e.g., C:\Program Files\PostgreSQL\17\bin)
Click OK
