import { Hono } from "hono"

export const userRoutes = new Hono()

userRoutes.get("/", (c) => {
  return c.json({
    message: "Get all users"
  })
})

userRoutes.post("/signup", async (c) => {
  const body = await c.req.json()

  return c.json({
    message: "Signup route working",
    data: body
  })
})