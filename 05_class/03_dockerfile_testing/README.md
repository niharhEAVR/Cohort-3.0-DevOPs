
### After pushing the dockerfile in the dockerhub then the cool thing is now anyone can get the docker file and run on their machine untill its public

```sh
docker run -d -p 3001:3001 --env-file .env   niharlnx/hello-world-app 

# or

docker run -d -p 3001:3001 -e DATABASE_URL=mongodb+srv://username:password@cluster0.kpsu7.mongodb.net/users   niharlnx/hello-world-app
```