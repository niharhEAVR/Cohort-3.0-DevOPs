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



---
---
---




## 🧠 First: connect to your database

If you’re in a terminal:

```bash
psql -U postgres -d postgres
```

or (shorter, with full connection string)

```bash
psql postgresql://postgres:me@localhost:5432/postgres
```

---

## 🏠 Inside `psql`: Basic Navigation

| Command           | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `\l`              | List all databases                                   |
| `\c <dbname>`     | Connect (change) to another database                 |
| `\dt`             | List all tables in the current database              |
| `\d <table_name>` | Show schema (columns, types, constraints) of a table |
| `\du`             | List all roles/users                                 |
| `\q`              | Quit psql                                            |

✅ Example:

```sql
\l
\c postgres
\dt
\d user
```

---

## 🔍 Viewing Data (SQL commands)

| Command                                      | Description                            |
| -------------------------------------------- | -------------------------------------- |
| `SELECT * FROM user;`                        | Show all rows from the `user` table    |
| `SELECT username, password FROM user;`       | Show selected columns                  |
| `SELECT COUNT(*) FROM user;`                 | Count how many rows                    |
| `SELECT * FROM user LIMIT 5;`                | Show first 5 rows                      |
| `SELECT * FROM user ORDER BY username DESC;` | Sort results                           |
| `DELETE FROM user WHERE username = 'Ava';`   | Delete matching rows                   |
| `TRUNCATE TABLE user;`                       | Delete all rows (keep table structure) |

---

## 🧱 Table & Schema info

| Command        | Description                                              |
| -------------- | -------------------------------------------------------- |
| `\dn`          | List schemas (usually just `public`)                     |
| `\dt public.*` | List tables inside a specific schema                     |
| `\d+ user`     | Show extra info (indexes, size, etc.) about `user` table |

---

## ⚙️ System info

| Command     | Description                        |
| ----------- | ---------------------------------- |
| `\conninfo` | Show current connection details    |
| `\! clear`  | Clear terminal screen              |
| `\timing`   | Toggle query execution time on/off |

---

## 💡 Pro tip: Pretty-print results

By default, psql can look ugly. Enable expanded view for wide rows:

```sql
\x on
SELECT * FROM user;
```

Now each column prints vertically (cleaner for JSON/text fields).

---

## 🚀 Common workflow for you (in Docker)

1. Access the Postgres shell:

   ```bash
   docker exec -it postgres psql -U postgres -d postgres
   ```
2. Inside psql:

   ```
   \dt
   SELECT * FROM "user";
   ```

   (Quotes needed because `user` is a reserved word in SQL.)
