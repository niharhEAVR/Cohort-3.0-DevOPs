### Todays class slide link

[**https://projects.100xdevs.com/tracks/prom-graf-1/Prometheus-and-Grafana-10**](https://projects.100xdevs.com/tracks/prom-graf-1/Prometheus-and-Grafana-10)

- todays class formed from slide no 10 to end

---

### Commands for codes (this code is same as previous class but in better structure)


```sh
bun init 
bun add express prom-client
bun add -D @types/express  
```

---

### On our previous class we only achieved the metrics portion, And from this class we will actually run the prometheus and try to scrape data every 15 seconds from the node-app

#### 1. separately running both the node-app and prometheus

```sh
# commands for running
# make the prometheus.yml first then 
# create a dockerfile for node-app
# then run these

# create a docker network then connect both of them into that network
docker network create prom-moniter
docker network ls

# build the node app
docker build -t node-app .

# run the app 
docker run -d --name node-app --network prom-moniter -p 3000:3000 node-app

# and make use in the prometheus.yml file target should written as node-app:3000, i mean same as docker container name, not localhost anymore

# run the prometheus
docker run -d --name prometheus --network prom-moniter -p 9090:9090 -v ./prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
```

#### and this is done 

- visit the http://localhost:3000/metrics you will see the app is running completely fine
- and visit the http://localhost:9090/metrics you will see the prometheus is also running scraping data from our app every 15 seconds

---

#### 2. running both the node-app and prometheus at once using docker-compose

```sh
# create the prometheus.yml file 
# create a dockerfile for the node app
# then setup up the compose file
# and make use you are in the node-app folder 

docker-compose up

# to rebuild again 
docker-compose up --build

# only start the containers after `up`
docker-compose start

```
