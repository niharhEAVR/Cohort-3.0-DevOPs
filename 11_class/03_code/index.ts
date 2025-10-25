import { AutoScalingClient, SetDesiredCapacityCommand } from "@aws-sdk/client-auto-scaling";

// this protion is connection me to the aws 
const client = new AutoScalingClient({region:"ap-south-1", credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
}})

const command = new SetDesiredCapacityCommand({
    AutoScalingGroupName:"bolt-asg",
    DesiredCapacity:3
})

const data = await client.send(command);

console.log(data);
