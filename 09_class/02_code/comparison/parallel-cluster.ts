import cluster from "cluster";
import * as os from "os";

const totalCPUs: number = os.cpus().length;
const target: number = 1_000_000_000_0; // 1 trillion

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking ${totalCPUs} worker processes...`);

  const startTime: number = Date.now();
  let completedWorkers: number = 0;
  let totalSum: number = 0;

  for (let i = 0; i < totalCPUs; i++) {
    const worker = cluster.fork();
    const start = i * (target / totalCPUs);
    const end = (i + 1) * (target / totalCPUs);

    worker.send({ start, end });

    worker.on("message", (message: { sum: number }) => {
      console.log(`Worker ${worker.process.pid} completed. Partial Sum: ${message.sum}`);
      totalSum += message.sum;
      completedWorkers++;

      if (completedWorkers === totalCPUs) {
        const endTime: number = Date.now();
        console.log(`Parallel (Cluster) Total Sum: ${totalSum}`);
        console.log(`Parallel (Cluster) total time: ${endTime - startTime} ms`);
        process.exit();
      }
    });

    worker.on("exit", (code) => {
      console.log(`Worker ${worker.process.pid} exited with code ${code}`);
    });
  }
} else {
  process.on("message", (message: { start: number; end: number }) => {
    let count: number = 0;
    for (let i = message.start; i < message.end; i++) {
      count += i;
    }

    console.log(`Worker ${process.pid} sending sum: ${count}`);
    process.send?.({ sum: count });

    setTimeout(() => process.exit(), 100); // Give time to send message before exiting
  });
}
