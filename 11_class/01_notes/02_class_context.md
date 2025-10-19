1. First checkout the 02_code folder and understand how this thing works and read the 03_dockerfile.md for better understanding.

---

2. Now goto AWS and Create a t2.medium instance with a 8080 post open (we need t2.medium because the browser vscode needs atleast 2cpus and 4gb ram)

---

3. SSH into that base machine then install docker inside: 
   🔗 **Docker Installation Guide**:  
    [Install Docker on Ubuntu 24.04 - Vultr Docs](https://docs.vultr.com/how-to-install-docker-on-ubuntu-24-04)

---

4. Now run the code-server inside that vm:
    ```sh
    vi Dockerfile # paste the content from your 02_code/Dockerfile
    (ctrl c + :wq + enter)
    sudo docker build -t heavrdevs .
    docker run -d -p 8080:8080 --name heavrdevs heavrdevs 
    ```

---

5. Now visit the http://<aws-vm-ip>:8080

---

6. If the current setups works fine then go forward and create an image, then a launch template with a specification of base instance (including the security group for ssh and 8080) and in userdata section paste this:

```sh
#!/bin/bash
sudo docker run -d -p 8080:8080 heavrdevs
```

---

7. Now for this project we dont need load balancer and target groups because we are managing one machine should only opens for one user

---

8. Create a ASG with the existing launch template and in the network zone section choose only one network zone (aws-south-a1) like this and then desired capacity only 1 for now and skip to the reviews and create ASG

---

9. so when you will get the new instance created by the ASG try visit to that ip:8080 and see browser vscode running on that ip or not, if not then ssh into that instance and paste this command:
```sh
cat /var/log/cloud-init-output.log
```
and find out where is the problem and then go to your launch template userdata do some changes over there and create a new version of its and select that version for the ASG also and create a new instance again with the new version

---

10. Our setup is almost done now we are heading towards the orchestrator for the routing thing:

    - for this we goes into to IAM page of AWS and create a user called heavrdevs-user click next
    - on the permission policies section sreach for this two access: 1. autoScalingFullAccess, 2. ec2FullAccess
    - then create the user
    - after creating click on the heavrdevs-user and go inside and then on the bar click on the Security credentials
    - scroll down and click on the Create access key
    - select Command Line Interface (CLI), scroll down tick on the checkbox and click on next
    - skip to the second section and click on the Create Access key
    - now you will see two things Access key, Secret access key and copy both of them one by one and store it on an .env file
    - why did we created a user like this way is because:
    
The IAM user is created this way specifically to **safely allow your orchestrator (probably a backend or CLI-based app)** to **programmatically interact with AWS services** (like EC2 and Auto Scaling) **without logging into the AWS Console manually**.

Here’s why each step is done the way it is:

### ✅ Why we create a new IAM user (`heavrdevs-user`)
- **Purpose**: To give a dedicated identity to the backend app (or CLI tool) that will run orchestrator code.
- **Best Practice**: You **shouldn’t use your root AWS account** or personal IAM user for automated tasks.
- A dedicated user keeps **permissions scoped**, actions **auditable**, and credentials **revocable** independently.

### ✅ Why we attach only `AutoScalingFullAccess` and `EC2FullAccess` policies
- These two allow the orchestrator to:
  - **Scale EC2 instances up/down** via Auto Scaling groups
  - **Manage EC2 instances directly** if needed (start, stop, tag, etc.)
- We avoid giving `AdministratorAccess` — it’s **too broad** and could be dangerous if the credentials are leaked.

### ✅ Why we generate Access Key + Secret Key
- Your orchestrator script/tool (e.g., in TypeScript + Express) **needs credentials to talk to AWS programmatically**.
- Access Key + Secret Key are used by AWS SDKs/CLIs to authenticate requests.
- They’re like a username/password pair but for automation purposes.

### ✅ Why we store them in a `.env` file
- Never hard-code sensitive values!
- `.env` is read by most backend frameworks (like Node.js via `dotenv`) and makes it easy to:
  - **Keep secrets out of source code**
  - **Switch environments** (dev/staging/prod)
  - **Avoid accidentally committing credentials** (you can add `.env` to `.gitignore`)

---

**Not-finished-yet** (you can skip this part)
11. create a seperate folder (03_code) on your pc:
```sh
bun init # select blank
bun add @aws-sdk/client-auto-scaling @aws-sdk/client-ec2 @types/express cors express
```
    - so what we are doing is that we are not gonna manually scale our instances for aws asg, we need a orchestrator for doing its own (by checking how many machines are up, how users are currently in the app, what machines are not in use, it will stop them or create new instances depending on the user)
    - 10_class we did it by aws > autoscaling groups > automatic scalling > Dynamic scaling policies
    - today we will be doing it by the index.ts file
    - on the 10th point you have copied two keys, now use them in your bun project
    - so todays orchestrator havent finished yet