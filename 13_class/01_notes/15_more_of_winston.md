```js
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" })
  ]
});

logger.info("Server started");
logger.error("Something failed");
```

---

# 🧠 Step-by-Step Explanation

---

## 1️⃣ `import winston from "winston";`

You are importing the Winston library.

It gives you:

* `createLogger`
* `format`
* `transports`

---

## 2️⃣ `winston.createLogger({...})`

This creates a **logger object**.

Think of this as your custom logging machine.

Everything inside `{}` is configuration.

---

## 3️⃣ `level: "info"`

This sets the minimum log level.

It means:

* `error` ✅ will log
* `warn` ✅ will log
* `info` ✅ will log
* `debug` ❌ will NOT log

Because `debug` is lower than `info`.

Log hierarchy:

```
error > warn > info > http > verbose > debug > silly
```

---

## 4️⃣ `format: winston.format.json()`

This means logs will look like:

```json
{
  "level": "info",
  "message": "Server started"
}
```

Structured JSON logs are better for production tools.

---

## 5️⃣ `transports`

This is VERY important.

Transport = where logs go.

You configured 2:

### 🖥 Console transport

```js
new winston.transports.Console()
```

Logs go to terminal (stdout).

---

### 📄 File transport

```js
new winston.transports.File({
  filename: "error.log",
  level: "error"
})
```

Only `error` level logs go into `error.log`.

So:

```js
logger.error("Something failed");
```

Will be saved in:

```
error.log
```

---

## 6️⃣ Logging

```js
logger.info("Server started");
logger.error("Something failed");
```

These send logs to:

* Console
* And error logs to file

---

# 🚀 Now Let’s Improve It (Production Style)

Right now it's too basic.

For your backend app, you should:

* Add timestamps
* Add environment-based levels
* Add better formatting
* Separate dev & production behavior

---

# ✅ Improved Version (Better for Your Backend)

```js
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error"
    }),

    new winston.transports.File({
      filename: "logs/combined.log"
    })
  ]
});

export default logger;
```

---

# 🧠 What We Improved

### ✅ Dynamic log level

In development → show debug logs
In production → hide debug logs

---

### ✅ Timestamp added

Now logs look like:

```json
{
  "level": "error",
  "message": "DB failed",
  "timestamp": "2026-02-19T10:30:00.000Z"
}
```

---

### ✅ Error stack traces

If you log:

```js
logger.error("DB error", errorObject);
```

You’ll get full stack trace.

Very useful for debugging.

---

# 🏗 How You Would Use It in Your App

## In Express

```js
import logger from "./logger.js";

app.post("/room", async (req, res) => {
  logger.info("Creating room", { user: req.userId });

  try {
    // room logic
  } catch (err) {
    logger.error("Room creation failed", { error: err });
  }
});
```

---

## In WebSocket

```js
ws.on("connection", (socket) => {
  logger.info("New WebSocket connection");

  socket.on("message", (msg) => {
    logger.debug("Incoming WS message", { msg });
  });
});
```

---

# ⚠️ Important For Your EC2 / Docker Setup

If you are using AutoScaling:

❌ Do NOT rely on file logs only
✅ Keep Console transport
→ Let Docker capture logs
→ Send to centralized system

In production scalable system, file logging is usually removed.

---

# 🎯 If You Want To Make It Even Better

You can add:

* Log rotation (so files don’t grow infinitely)
* Request logging middleware
* Correlation ID per request
* Separate log files for API & WS

---
---
---
---
---
---



# 🧠 What Is Log Hierarchy?

Log levels are ordered by **severity (importance)**.

Think of it like:

```
🔥 error   → Something broke
⚠️ warn    → Something suspicious
ℹ️ info    → Normal important event
🌐 http    → HTTP request log
🔍 verbose → More detailed info
🐛 debug   → Debugging developer info
🤪 silly   → Extremely detailed internal logs
```

Now the key rule:

> If you set `level: "info"`
> Winston will log everything ABOVE or EQUAL to info.

---

# 🧱 How The Ordering Works Internally

Winston assigns numeric values:

```
error:   0
warn:    1
info:    2
http:    3
verbose: 4
debug:   5
silly:   6
```

Lower number = more serious.

So when you set:

```js
level: "info"
```

It means:

> Log everything with number <= 2

So Winston logs:

```
error (0) ✅
warn (1)  ✅
info (2)  ✅
```

But it ignores:

```
http (3) ❌
verbose (4) ❌
debug (5) ❌
silly (6) ❌
```

---

# 🎯 Example In Practice

If your config is:

```js
level: "warn"
```

And you do:

```js
logger.error("DB crashed");
logger.warn("Retrying DB connection");
logger.info("User logged in");
```

Output will be:

```
DB crashed        ✅
Retrying DB       ✅
User logged in    ❌
```

Because `info` is below `warn`.

---

# 🏗 In Your Backend Project

Imagine your WebSocket app:

### In Development

You want everything:

```js
level: "debug"
```

So you can see:

* Incoming payloads
* Redis pub/sub events
* DB queries
* Connection logs

---

### In Production

You don’t want noisy logs.

You use:

```js
level: "info"
```

Now only:

* Errors
* Warnings
* Important events

Are logged.

---

# 🧠 Why This Hierarchy Exists

Because logging too much:

* Slows app
* Fills disk
* Makes debugging harder
* Costs money in log platforms

So we control verbosity using levels.

---

# 🧪 Quick Mental Model

Imagine a water filter:

If filter is set to "info"

Big stones (error) pass ✔
Medium stones (warn) pass ✔
Small stones (info) pass ✔
Sand (debug) blocked ❌

If filter is set to "debug"

Everything passes.

---

# 🔥 Real Example (Your Room App)

```js
logger.error("Database failed");       // serious
logger.warn("Redis reconnecting");     // not critical but important
logger.info("Room created");           // normal event
logger.debug("Incoming payload", body); // developer debugging
```

Production → level: "info"
So debug logs disappear.

Development → level: "debug"
Everything shows.

---

# 💡 Important For You As Backend Dev

When building scalable infra:

* Dev → debug level
* Staging → info
* Production → warn or info

Never run production with debug unless debugging issue.
