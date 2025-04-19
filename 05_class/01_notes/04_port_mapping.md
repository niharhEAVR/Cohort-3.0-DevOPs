Port mapping in Docker is the process of exposing a container's internal ports to the host machine, allowing external access to services running inside the container.

### Understanding the Two Ports:
When you run:
```bash
docker run -d -p 27017:27017 mongo
```
- The first `27017` (before `:`) is the **host** machine's port.
- The second `27017` (after `:`) is the **container**'s port.

This means that:
- MongoDB inside the container is running on port `27017` (default for MongoDB).
- It is mapped to port `27017` on your local machine.
- Now, you can connect to MongoDB using `mongodb://localhost:27017` from your host system.

If you wanted to map MongoDB’s port to a different host port, you could do:
```bash
docker run -d -p 28000:27017 mongo
```
- This maps **port 27017 of the container** to **port 28000 of the host**.
- Now, you can connect to MongoDB using `mongodb://localhost:28000`.
