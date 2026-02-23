# Todays class slide link:



[**https://projects.100xdevs.com/tracks/prom-graf-1/Prometheus-and-Grafana-1**](https://projects.100xdevs.com/tracks/prom-graf-1/Prometheus-and-Grafana-1)

- class formed from slide 1 to slide 9

---

- So on the 3rd slide we are trying to achieve a small feature where if the user visits any endpoint we will get to see the time its taken for load that site

- on the 3rd slide instead of doing whatever written there, do these:

```sh
bun init
bun add express @types/express
```

- add this code in index.ts

- `index.ts`

```ts
import express from "express";
import type { Request, Response, NextFunction } from "express";

const app = express();
app.use(express.json());

const middleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    next();
    const endTime = Date.now();
    console.log(`Request took ${endTime - startTime}ms for ${req.method} ${req.url}`);
} 

app.use(middleware);

app.get("/user", (req, res) => {
    res.send({
        name: "harsh bardhan",
        age: 21,
    });
});

app.get("/cpu", (req, res) => {
    for (let i = 0; i < 100000; i++) {
        Math.random();
    }
    res.send({
        cpu: "cpu is up and running",
    });
});

app.listen(3000);
```

---

- Now come to the 5th & 6th slide and there is we are adding the counter metrics for the prometheus connections, so instead of doing those, do these:

```sh
bun add prom-client
```

- modify the `index.ts` and add these code along with precious ones
- instead of the previous normal middleware use this `middleware` now and remove the previous one

```ts
import client from "prom-client";

const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

const middleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const endTime = Date.now();
        console.log(`Request took ${endTime - startTime}ms`);

        requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });
    });

    next();
};

app.use(middleware);

app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})
```

- now visit the http://localhost:3000/metrics

- you will see the logs

---

- Now for the 7th slide do these


- Add This Below Your Counter

```ts
const activeRequestsGauge = new client.Gauge({
    name: 'active_http_requests',
    help: 'Number of currently active HTTP requests'
});
```

- Update Your Middleware

- Modify your middleware like this:

```ts
const middleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // 🔹 Request started → increase gauge
    activeRequestsGauge.inc();

    res.on('finish', () => {
        const endTime = Date.now();
        console.log(`Request took ${endTime - startTime}ms`);

        // 🔹 Request finished → decrease gauge
        activeRequestsGauge.dec();

        requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });
    });

    next();
};
```

- and modify the /cpu endpoint also

```ts
app.get("/cpu", async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
    res.send({
        cpu: "cpu is up and running",
    });
});
```

- now when you visits the /cpu then it will wait for 5 seconds and in the /metrics endpoint you will see the active users count

---

- now we will add the histogram for our code from slide 8

- on `index.ts` file add this

```ts
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000]
});
```

- then modify the middleware

```ts
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
```

- update the `/cpu` endpoint also

```ts
app.get("/cpu", async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000)); // 5 second delay
    res.send({
        cpu: "cpu is up and running",
    });
});
```

---


# So on todays class we only achieved the metrics portion from the prometheus diagram [click](https://projects.100xdevs.com/tracks/prom-graf-1/Prometheus-and-Grafana-2)