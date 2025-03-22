### Todays class slide link:


```link
https://petal-estimate-4e9.notion.site/Autoscaling-groups-1a27dfd1073580adaaccc785189f156f
```

### Today's Class Context:  

1. **Create an EC2 VM**  
2. **Clone the ASG repository** from [NIHAR-DEBNATH's GitHub](https://github.com/NIHAR-DEBNATH/ASG)  
3. **Install required package managers**: Bun, Node.js, and PM2  
4. **Set up and run the application**:  
   - After executing `bin.ts`, ensure everything is working correctly  
5. **Create an image of the VM**  
6. **Set up a launch template** using the created image  
   - In the **Advanced Tab (User Data section)**, add the following pre-run script:  

   ```sh
   #!/bin/bash 
   export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v22.14.0/bin/
   npm install -g pm2
   pm2 ls
   cd ~/ASG
   bun install
   pm2 start --interpreter /home/ubuntu/.nvm/versions/node/v22.14.0/bin/bun /home/ubuntu/ASG/bin.ts
   ```  

7. **Create a target group**  
8. **Set up an Auto Scaling Group (ASG)**  
   - You'll get an option to create a new **Load Balancer**—configure both properly  
9. **Verify the setup**  
   - Visit `http://load-balancer-ip/host`  
   - Refresh the page multiple times  
   - You should see different instance IPs appearing, confirming that the cluster is distributing traffic across multiple instances  

This ensures that your **Auto Scaling Group (ASG) is successfully handling load balancing** by utilizing different instances dynamically. 🚀