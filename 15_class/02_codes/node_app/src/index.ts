import express from "express";
import client from "prom-client";
import { middleware } from "./middleware";
import { metricsMiddleware } from "./metrics/metricsMiddleware";

const app = express();

app.use(express.json());
app.use(middleware);
app.use(metricsMiddleware);

app.get("/cpu", async (req, res) => {

    await new Promise((resolve) => setTimeout(resolve, 5000));
    res.send({
        usage: "50%",
    });
});

app.get("/user", (req, res) => {
    res.send({
        name: "John Doe",
        age: 25,
    });
});

app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})

app.listen(3000);