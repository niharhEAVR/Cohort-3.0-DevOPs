## 🧭 Step-by-Step: Using the GraphiQL API Explorer

### **Open the explorer**

1. Go to [https://api.newrelic.com/graphiql](https://api.newrelic.com/graphiql)
2. You’ll see a page with a query editor on the left and results on the right.

---

## 🧩 Step-by-step from here

### **1. Add your User API Key**

In the top bar where it says **“User key:”**
paste your **User API key** — the one that starts with

```
NRAK-
```

then click **Submit** ✅

If your key is correct, the red error (`Please provide a user API Key...`) will disappear.

---

### **2. Test the connection**

Replace the editor contents with this query and press the pink ▶ **Run** button:

```graphql
{
  actor {
    user {
      name
      email
    }
  }
}
```

➡️ You should see your New Relic username and email in the right-hand panel.
That confirms your key works.

---

### **3. Discover available delete mutations**

Now we’ll find the correct mutation for your account.

1. In the **left sidebar**, scroll down and click the **“Docs”** icon 📖 (bottom-left).
   This opens the schema documentation.

2. Expand the **“mutation”** section.
   You’ll see a list of all available mutation names, e.g.:

   * `entityDelete`
   * `entityDeleteMany`
   * `entityManagementDelete`
   * `agentApplicationDelete`
   * etc.

3. Click each `entity...` option and look in the docs pane for the **arguments** it takes.
   We’re looking for something like:

   ```
   entityDelete(entityGuid: ID!): EntityDeleteResult
   ```

   or

   ```
   entityDelete(guid: ID!): EntityDeleteResult
   ```

   or

   ```
   entityDeleteMany(guids: [ID!]!): EntityDeleteManyResult
   ```

   That tells you **exactly** which parameter name your schema expects.

---

### **4. Run the correct mutation**

Once you’ve confirmed the right one, paste it in the editor and run it.

Example if your schema shows `entityDelete(entityGuid:)`:

```graphql
mutation {
  entityDelete(entityGuid: "NjY5NzkwNnxJTkZSQXxOQXw4NTUxNTgxMTA4NjQ0NDE2MTQ5") {
    deletedGuids
  }
}
```

If your schema uses `entityDeleteMany(guids:)`:

```graphql
mutation {
  entityDeleteMany(guids: ["NjY5NzkwNnxJTkZSQXxOQXw4NTUxNTgxMTA4NjQ0NDE2MTQ5"]) {
    deletedGuids
  }
}
```

You should get a success response like:

```json
{
  "data": {
    "entityDelete": {
      "deletedGuids": ["NjY5NzkwNnxJTkZSQXxOQXw4NTUxNTgxMTA4NjQ0NDE2MTQ5"]
    }
  }
}
```

---

### **5. Verify**

Go back to your **All Entities** page → refresh →
the deleted host should be gone (or disappear within a few minutes).
