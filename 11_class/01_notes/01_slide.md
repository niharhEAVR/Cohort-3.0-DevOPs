### Todays class slide link:

https://projects.100xdevs.com/tracks/prom-graf-1/Prometheus-and-Grafana-1

---

#### Todays class context is a hosting, where we host whole vs-code setup on the aws ec2 instance

- That means we are kinda building a leetcode or bolt or lovable or replit kinda things where poeples can do code or save & submit their code

- The idea of todays class is that there will be a `backend` node js server in between the user and aws machines, where if any users wants a code editor then they can sighup up and node js server will auto assign a aws machine to that specific user (and if the user idle for 10min then the node js server will auto stop/kill that aws machine)

- The more of node js server also continiously checks how many machine are `up` and if the mashine number is below a minimum then it will increase machines simultaneously, Because when the neq user comes they will instantly need a machine