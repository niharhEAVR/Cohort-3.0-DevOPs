### Delete all the previously created container and images from the local docker app or cli and nod do this 

### After pushing the dockerfile in the dockerhub then the cool thing is now anyone can get the docker file and run on their machine untill its public

```sh
docker pull niharlnx/hello-world-app

docker run -d -p 3001:3001 --env-file .env   niharlnx/hello-world-app 

# or

docker run -d -p 3001:3001 -e DATABASE_URL=mongodb+srv://debnathnihar14:t8pdTZO5djPzm8NQ@cluster0.ioks0j6.mongodb.net/users   niharlnx/hello-world-app
```