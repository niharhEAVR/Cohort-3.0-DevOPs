There is a nice little trick of go inside a docker postgres server and access it by psql:


```sh
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=me --name postgres postgres

docker ps

docker exec -it <cointainer id of postgres> sh

psql -U postgres

# Now you are inside that docker postgres container
```


---
---
---



## ⚡️ TOP 20 `psql` COMMANDS (REAL DEV USE)

### 🧭 Connection & Navigation

```bash
\l                   # list all databases
\c postgres          # connect to a specific database
\conninfo            # show current connection info
\q                   # quit psql
```

---

### 🧱 Tables & Structure

```bash
\dt                  # list all tables in current DB
\dt+                 # list tables + sizes
\d "user"            # describe table structure
\d+ "user"           # describe table + indexes + storage info
\dn                  # list schemas (usually 'public')
```

---

### 🔍 Viewing Data

```bash
\x on                # toggle expanded view (for JSON or wide data)
\pset pager off      # disable scrolling pager
\timing on           # show execution time after each query
```

*(Now you can safely run SQL like:)*

```sql
SELECT * FROM "user" LIMIT 5;
```

---

### 💾 Input & Output

```bash
\i script.sql        # run commands from a file
\o output.txt        # send results to file
\o                   # turn off file output (back to screen)
\copy "user" TO 'users.csv' CSV HEADER  # export table to CSV
\copy "user" FROM 'users.csv' CSV HEADER  # import CSV into table
```

---

### 👤 Roles & Permissions

```bash
\du                  # list users/roles
\du+                 # list roles with privileges
```

---

### ⚙️ Display & Formatting

```bash
\pset format aligned # normal pretty output (default)
\pset format csv     # output query results as CSV
\a                   # toggle aligned/un-aligned mode
\H                   # toggle HTML output (for web debugging)
```

---

### 🧠 System & Debug

```bash
\! clear             # clear terminal
\set PROMPT1 '%n@%/%R%# '   # customize prompt (optional)
\watch 2             # rerun last query every 2 seconds
```

---

## 💡 Pro developer combos

| Goal                                         | Commands                                |
| -------------------------------------------- | --------------------------------------- |
| See all Prisma tables                        | `\dt`                                   |
| Check a table’s schema quickly               | `\d+ "user"`                            |
| View JSON/long data cleanly                  | `\x on`                                 |
| Disable the annoying pager                   | `\pset pager off`                       |
| Measure query speed                          | `\timing on`                            |
| Keep refreshing a query (like watching logs) | `SELECT COUNT(*) FROM "user"; \watch 1` |
| Export to CSV for debugging                  | `\copy "user" TO 'data.csv' CSV HEADER` |

---

✅ **Example workflow for you**

```bash
docker exec -it postgres psql -U postgres -d postgres
```

then inside psql:

```bash
\dt
\d+ "user"
\x on
SELECT COUNT(*) FROM "user";
\timing on
\watch 2
```
