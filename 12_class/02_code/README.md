```sh
cd 12_class/02_code
docker build -t node-app .
docker run -d -p 3000:3000 node-app
```