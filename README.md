### All Important Class Slides links:

🔗 [All class Slides](https://web-dev-cohort.notion.site/IMPORTANT-LINKS-164ff7be602980689c99d982073c8e1b)

---

### ✅ Progress

Study completed up to **week 30 > 30.1 | AWS ERC, ECS and container orchestation** 

---

### 🧠 Skills Learned So Far From (DEVOPs)

* *Package Managers:* bun ([Bun offical Doc](https://bun.com/docs), [more of bun](./08_class/01_notes/02_bun.md)), pm2 (for managing projects inside the vm)

* *Side Effects:* VM (virtual machine), SSH (secure shell protocall), SSL (Secure Sockets Layer) certificate, Yaml or Yml

<br>

* **AWS (ASG)**
* **NGINX**
* **CI-CD Pipeline**
* **Docker**
* **Newrelic for Monitering**


---

### Node.js installation process for ubuntu:

🔗 **Docker Installation Guide**:  
    [Install Nodejs on Ubuntu 24.04 - Digitalocean Docs](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04#option-3-installing-node-using-the-node-version-manager)

- **Or follow these steps**

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

source ~/.bashrc

nvm install --lts

# For test:

node -v
npm -v
```

---

### Docker installation process for ubuntu:
🔗 **Docker Installation Guide**:  
    [Install Docker on Ubuntu 24.04 - Vultr Docs](https://docs.vultr.com/how-to-install-docker-on-ubuntu-24-04)

- **Or follow these steps**

```sh
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y

sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# For test:

sudo docker --version
```


---

## Needed dokcer commands

**[click](./05_class/01_notes/05_commands.md)**

---

### How to deploy your website to production in 30 minutes

🔗 [How to deploy your website to production in 30 minutes](https://www.youtube.com/watch?v=gViEtIJ1DCw)


---

### How to ssh into an aws machine

```sh
ssh -i ~/.ssh/mykey.pem <OS-or-User-name>@<SERVER_IP>
```

---


### PM2 commands daily-use:

```bash
pm2 start app.js --name myApp      
# start app.js with a custom name "myApp"

pm2 list                            
# show all PM2-managed apps with status and uptime

pm2 show myApp                      
# display detailed information about "myApp"

pm2 monit                           
# real-time CPU, memory, and logs monitoring

pm2 logs                            
# stream logs for all apps
pm2 logs myApp                      
# stream logs only for "myApp"

pm2 stop myApp                      
# stop the running app "myApp"
pm2 restart myApp                   
# restart "myApp" (zero-downtime reload)
pm2 reload all                      
# reload all apps gracefully

pm2 delete myApp                    
# remove "myApp" from PM2 process list

pm2 startup                         
# generate startup script for your OS
pm2 save                           


pm2 -v                              
# check PM2 version
pm2 help                            
# list all available PM2 commands

pm2 list --sort memory              
# list apps sorted by memory usage
pm2 describe myApp                  
# show detailed app metadata

# Watch for file changes (auto-restart on change)
pm2 start app.js --watch             
# restart app automatically when files change

pm2 update                           
# update PM2 to latest stable version

pm2 kill                             
# stop and remove all PM2 processes + daemon
```


---

### 🧠 Skills Learned So Far From (Web Dev)

* *Package Managers:* (npm), (pnpm)

* **Node.js**
* **Express.js**
* **MongoDB (Mongoose)**
* **React.js** (vite, zustand)
* **Tailwind Css** [Click Here to see the Tailwind css major change v4](https://www.youtube.com/watch?v=bupetqS1SMU)
* **TypeScript**
* **Websocket**
* **Postgres Sql (NeonDB, ORM: Prisma)** [Click Here to setup the Prisma7](https://www.prisma.io/docs/orm)
* **Next.js (CSR, SSR, SSG, ISR)** [How to install prisma in the Next app. Click Here](https://www.youtube.com/watch?v=Ndhx_rNkoUw&t).
* **TurboRepo**


---

### Some important commands:

```sh
# Node
npm init -y # For declaration of package.json


# For saving DevDependencies
# --save-dev 
# -D

# React
npm create vite@latest 

# Typescript
npm install -g typescript ts-node
tsc --init
tsc -b
npm install -g ts-node
ts-node ./src/index.ts # Direct run the ts files, no need compilations.

# Prisma
npm install prisma
npx prisma migrate dev --name <name> # Creating or changing the original table.
npx prisma studio # To visually check the database
npx prisma migrate reset # For new comers, they can initialize the table.
npx prisma generate # PrismaClient generator.

# Next
npx create-next-app@latest

# Turborepo
npx create-turbo@latest

# Alternate package manager
pnpm # npm
pnpm dlx # npx
```


---

# Upto 12_class revision is done

---

# Todos or Revisit

1. `Revisit:-` **09_class** is load balancer's root class & root scalling, And also so revise this class properly, Cuase it will help to understand how load balancer & scaling works 
2. `Revisit:-` **12_class** revisit it again for more depth knowledge And add these Features
    (1. Add a CI/CD pipeline that pushes every commit to ECR) (It is Done but the problem is inner concepts, i have to learn all the things again)
    (2. Certificate Managment by AWS Certificate Manager)