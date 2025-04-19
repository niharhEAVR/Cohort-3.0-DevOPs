There is a nice little trick of go inside a docker postgres server and access it by psql:


```sh
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=me --name postgres postgres

docker ps

docker exec -it <cointainer id of postgres> sh

psql -U postgres

# Now you are inside that docker postgres container
```