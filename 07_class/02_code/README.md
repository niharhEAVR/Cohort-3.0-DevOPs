## If you are revisng and manually wants to start that then do these:

```sh
docker pull postgres

docker run --name postgres -e POSTGRES_PASSWORD=me -d -p 5432:5432 postgres 

psql "postgres://postgres:me@localhost:5432"

# before doing this command you should must have a .env file on your
# root directory & inside that file there must be 
# (DATABASE_URL=postgres://postgres:me@localhost:5432) written.

npx prisma generate
npx prisma migrate dev --name init

```

```sql
\dt

SELECT * FROM "user";
DELETE FROM "user";

```


### ------------------------------------------------------------


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


### ------------------------------------------------------------

### If you are using the docker-compose.yml then you have to run only this commands:

```sh

docker-compose up
# or
docker-compose up -d # for running it on the background

psql "postgres://postgres:me@localhost:5432"

```