import { AutoScalingClient, DescribeAutoScalingInstancesCommand } from "@aws-sdk/client-auto-scaling";
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

const client = new AutoScalingClient({
    region: "ap-south-1", credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
})

const ec2Client = new EC2Client({
    region: "ap-south-1", credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
})

async function refreshInstances() {
    const command = new DescribeAutoScalingInstancesCommand();
    const data = await client.send(command);
    // console.log(data);

    // @ts-ignore    
    const ec2InstanceCommand = new DescribeInstancesCommand({
        InstanceIds: data.AutoScalingInstances?.map(x=>x.InstanceId)
    })
    const ec2Reponse = await ec2Client.send(ec2InstanceCommand);
    
    // @ts-ignore    
    
    // console.log(ec2Reponse);
    // this will the reservation object which contains multiple information about all the instances that are currently running by autoscaling group, it will not give the response of the initial instance that we created manually.
    
    // console.log(ec2Reponse.Reservations[0]?.Instances);
    // this will return a single element array  [{...}]
    
    
    console.log(JSON.stringify(ec2Reponse.Reservations[0]?.Instances[0]?.PublicDnsName));
    // @ts-ignore    
    console.log(JSON.stringify(ec2Reponse.Reservations[0]?.Instances[0]?.PublicIpAddress));
    // this will print the public dns name and ip add. of the first instance or 0th instance
    
    // see the 04_index2_code_output.md for better visualization
    
}

refreshInstances();

// setInterval(() => {
//     refreshInstances();
// }, 10 * 1000)