cd 11_code/02_code
docker build -t heavrdevs .
docker run -d -p 8080:8080 --name heavrdevs heavrdevs

# visit http://localhost:8080