### All Important Class Slides links:

🔗 [All class Slides](https://web-dev-cohort.notion.site/IMPORTANT-LINKS-164ff7be602980689c99d982073c8e1b)

---

### Node.js installation process for ubuntu:

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

### How to deploy your website to production in 30 minutes

🔗 [How to deploy your website to production in 30 minutes](https://www.youtube.com/watch?v=gViEtIJ1DCw)