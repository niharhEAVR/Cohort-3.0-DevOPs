### If you are using the Dockerfile then you have to run all this commands:

```sh
docker network create testing

docker run --name postgres --network testing -e POSTGRES_PASSWORD=me -d -p 5432:5432 postgres 

docker build -t user-app .

docker run --name user-app --network testing -e DATABASE_URL=postgres://postgres:me@postgres:5432 -p 3000:3000 user-app # or

docker run --name user-app --network testing --env-file .env -p 3000:3000 user-app


docker network rm testing
docker network ls

psql "postgres://postgres:me@localhost:5432"

```

---

### ------------------------------------------------------------

### If you are using the docker-compose.yml then you have to run only this commands:

```sh

docker-compose up
# or
docker-compose up -d # for running it on the background

psql "postgres://postgres:me@localhost:5432"

```

---

### ------------------------------------------------------------

```sql

\dt

SELECT * FROM "user";

DELETE FROM "user";

\q

```