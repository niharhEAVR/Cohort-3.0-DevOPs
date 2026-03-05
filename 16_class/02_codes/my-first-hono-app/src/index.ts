import { Hono } from "hono"
import { userRoutes } from "./routes/user"

const app = new Hono()

app.get("/", (c) => {
  return c.text("Hono server is running 🚀")
})

app.route("/users", userRoutes)

export default app