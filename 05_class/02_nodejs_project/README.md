### Commands that used for containerized this nodejs project

```sh
# First i created the nodejs project and setup all the things then 
docker build -t hello-world-app .
docker images
docker run -p 3001:3001 --env-file .env hello-world-app
docker ps

# -------------------------------------------------------------------------
docker exec -it < container id > sh
# After running this command you will redirect to your WORKDIR = /app # (means now you are inside that docker container of your hello-world-app, and now you can run the bash commands there)
# /app # ls
# /app # cat package.json
# the reason we should go inside the docker container is because if there is a bug then we can debug there
# -------------------------------------------------------------------------

# when you are done all the setup then you have to push this dockerfile into the dockerhub
docker login 
docker tag hello-world-app YOUR_DOCKERHUB_USERNAME/hello-world-app
docker push YOUR_DOCKERHUB_USERNAME/hello-world-app
docker logout


docker kill < container id >
docker rmi < image id >
```



### after the push go to the 03_dockerfile_testing folder