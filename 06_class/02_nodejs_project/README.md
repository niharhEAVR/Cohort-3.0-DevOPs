```sh
cd 06_class/02_nodejs_project
docker network create testing

docker network ls 

docker run -d -p 27017:27017 --name mongoDb --network testing mongo # and remember to put the same name in db.ts connection url, something like this: mongodb://mongoDb:27017/users

docker build -t users-app .

docker run -d -p 3000:3000 --name backend --network testing users-app

docker network rm testing
```


### Read 07_network_&_databases.md for understanding what these commands are for...