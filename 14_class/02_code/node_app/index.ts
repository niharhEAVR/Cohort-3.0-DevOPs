import express from "express";
import type { Request, Response, NextFunction } from "express";

const app = express();
app.use(express.json());

import client from "prom-client";

const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

const activeRequestsGauge = new client.Gauge({
    name: 'active_http_requests',
    help: 'Number of currently active HTTP requests'
});

const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000]
});

const middleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = process.hrtime(); // more accurate than Date.now()

    activeRequestsGauge.inc();

    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const durationInSeconds = seconds + nanoseconds / 1e9; // here the nanoseconds are converted to seconds and added to the seconds part
        // 1 second = 1,000,000,000 nanoseconds so if the nanoseconds comes as 345000000 then it will be converted to 0.345 seconds and added to the seconds part to get the total duration in seconds
        console.log(`Request took ${durationInSeconds * 1000}ms`);

        activeRequestsGauge.dec();

        requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });

        httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        }, durationInSeconds * 1000); // Convert seconds to milliseconds
    });

    next();
};

app.use(middleware);

app.get("/user", (req, res) => {
    res.send({
        name: "harsh bardhan",
        age: 21,
    });
});

app.get("/cpu", async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000)); // 5 second delay
    res.send({
        cpu: "cpu is up and running",
    });
});

app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})

app.listen(3000);