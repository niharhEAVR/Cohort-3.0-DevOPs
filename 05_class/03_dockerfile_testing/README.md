
### After pushing the dockerfile in the dockerhub then the cool thing is now anyone can get the docker file and run on their machine untill its public

```sh
docker run -p 3001:30001 --env-file .env  niharlnx/hello-world-app
```