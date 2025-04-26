### Todays class slide link:

```link
https://petal-estimate-4e9.notion.site/AWS-ECR-and-ECS-1b07dfd1073580c8b390ec714d183c3d
```

### Class Conext of todays is:

##### First read the 02_ECS_ECR.md and 03_ECS_in_more_details.md for the basic ideas what are these, then go forward

1. In this class we will use aws hub to push and pull our containerize application.
2. So start with creating a simple node.js app with two endpoints /cpu and /health
3. Build the image and run the container in your local machine.

---

4. Create a fresh user from IAM to manage this ecr process:

    - IAM > Users > Create user
    - name the user and click on next
    - click on the `Attach Policies Directly` and give it a `AmazonEC2ContainerRegistryFullAccess` this access then click on next
    - click on create user and after user creation go inside that user `(nihar-pc-ecr)` and click `Security Credentails`.
    - Scroll down and click on `Create access key` > ckeck the CLI > next > create access key
    - Copy both of them 
    - now log into aws in your local machine by typing `aws configure` in the terminal
    - AWS Access Key ID [None]: give your shadow user access key 
    - AWS Secret Access Key [None]:shadow user secret access key
    - Default region name [None]: your region or ap-south-1
    - leave other things like (press enter only) > Default output format [None]: 
    - AWS login is done for the shadow user, means that the user can access all the registry of aws of your main aws account 

---

5. Now `04_ECR_repo_creation_and_push.md` read this file and push your containerize app to the ecr hub (and make sure to install aws cli in windows), you can take help from this also [Creating ECR Repository, Pushing to ECR](https://petal-estimate-4e9.notion.site/Creating-ECR-Repository-Pushing-to-ECR-1b07dfd1073580dca783e62b8b7cad56).

    ```sh
    # Pushing commands all in once
    cd 12_class/02_code

    aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 381492183358.dkr.ecr.ap-south-1.amazonaws.com

    docker build -t heavrdevs/node-app .
    
    docker tag heavrdevs/node-app:latest 381492183358.dkr.ecr.ap-south-1.amazonaws.com/heavrdevs/node-app:latest

    docker push 381492183358.dkr.ecr.ap-south-1.amazonaws.com/heavrdevs/node-app:latest
    ```

---

6. Now read the `05_ECS_architcture.md` to get to know what are we gonna building

7. Now we will create a **cluster**, to create a cluster check this [Creating a Cluster](https://petal-estimate-4e9.notion.site/Creating-a-Cluster-1b07dfd1073580218595ee866a6381af)

---

8. Next create a **task definitions** :

##### 🛠️ First, **where to find it**?

👉 Go to your **AWS Console** → **ECS** →  
On the left menu, find "**Task Definitions**" ➔ Click "**Create new Task Definition**".

(It's separate from Cluster! You first create Task Definitions, then **use them inside the Cluster**.)

##### 🛠️ Second, **Fill out Task Definition Details**

Here’s what you’ll see and how to fill:

##### 1. **Task definition configuration**
- Give a Task definition family name, e.g., `node-app`
- (Any name, but should match your project.)

##### 2. **Infrastructure requirements**
- Launch type: choose AWS Fargate
- OS, Architecture, Network mode: leave default `Linux/X86_64`.
- Task size: CPU > 1vCPU and Memory > 3GB
- leave other things default

##### 3. **Container - 1**
- Name: give it a name.  
- Image URI: your contenairize app link which you pushed in ECR. example > `381492183358.dkr.ecr.ap-south-1.amazonaws.com/heavrdevs/node-app:latest`
- **Port Mappings**: So when you created the container you expose the 3000 port, so choose that port over there

- Keep rest of the things default, we dont need the rest things in todays class

✅ After everything → click **Create**.

Your **Task Definition** is now created!

---


9. Now we will create a **Service** for the ECS:

    - On your ECS page goto cluster > then go inside your created cluster
    - On the bar you will see `Services` and click on create
    - `06_cluster_service.md` -> in here all the steps are written for creating a service


10. Once your service is created and you sees that the 5/5 machines are running then in EC2 dashboard go to load balancer and go inside the load balancer security groups and make sure that the security group should have inbound rule of port 80 and 3000, if its not then edit the inbound rule and add these two ports

11. Now visit your http://loadbalancer_dns_url/cpu you will see that your node.js app is running. example of load balancer url should be: `http://node-app-load-balancer-1234920766.ap-south-1.elb.amazonaws.com/cpu`

12. You can attach your own domain name instead of load balancer url, for that you have to do:

    - go to your domain name app. ex -> bigrock
    - create a DNS records of CNAME
    - put your sub domain name and in the CNAME boc put your load-balancer-url and save
    - Now visit the `http://test.niharheavrdevs.online/cpu`
    - You will see your app
    - But this setup is for http resuests, to get the https requests we have to do others things that we will learn later