import { AutoScalingClient, DescribeAutoScalingInstancesCommand, SetDesiredCapacityCommand, TerminateInstanceInAutoScalingGroupCommand } from "@aws-sdk/client-auto-scaling";
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

type Machine = {
    instanceId: string;
    dns: string;
    ip: string;
    isUsed: boolean;
    // assignedProject?: string;
};

const ALL_MACHINES: Machine[] = [];
// the current state of all machines will be stored in this array
// and the structure of each machine will be like this
// {
//     instanceId: "i-0123456789abcdef0",
//     dns: "ec2-203-0-113-25.compute-1.amazonaws.com",
//     ip: "",
//     isUsed: false
// }


async function waitForInstancesToBeFullyReady() {
    while (true) {
        const asgData = await client.send(new DescribeAutoScalingInstancesCommand());

        const instanceIds = asgData.AutoScalingInstances?.map(x => x.InstanceId) || [];

        if (instanceIds.length === 0) {
            console.log("Still waiting — ASG hasn't fully registered instances...");
            await sleep(5000);
            continue;
        }

        const ec2Response = await ec2Client.send(
            // @ts-ignore
            new DescribeInstancesCommand({ InstanceIds: instanceIds })
        );
        
        const allReady = ec2Response.Reservations?.every(reservation =>
            reservation.Instances?.every(instance =>
                instance.State?.Name === "running" &&
                instance.PublicIpAddress && instance.PublicDnsName
            )
        );

        if (allReady) {
            console.log("All instances have Public DNS & IP — FULLY READY!");
            return;
        }

        console.log("Waiting for PublicIP/DNS to be assigned...");
        await sleep(5000);
    }
}

// @ts-ignore
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


async function machineUpInitial() {
    const command = new SetDesiredCapacityCommand({
        AutoScalingGroupName: "bolt-asg",
        DesiredCapacity: 2
    }) // Make sure there are at least 2 machines running
    const data = await client.send(command);
}

async function refreshInstances() {

    let asgData = await client.send(
        new DescribeAutoScalingInstancesCommand()
    );

    let instanceIds = asgData.AutoScalingInstances?.map(x => x.InstanceId) || [];

    if (instanceIds.length === 0) {
        console.log("No instances found in ASG.");
        await machineUpInitial();
        console.log("Two instances Started in ASG.");

        await waitForInstancesToBeFullyReady();
        console.log("Instances are now running. Continuing...");

        asgData = await client.send(
            new DescribeAutoScalingInstancesCommand()
        );
        instanceIds = asgData.AutoScalingInstances?.map(x => x.InstanceId) || [];
    }


    const ec2Response = await ec2Client.send(
        // @ts-ignore
        new DescribeInstancesCommand({ InstanceIds: instanceIds })
    );

    const freshMachines: Machine[] = [];

    ec2Response.Reservations?.forEach(reservation => {
        reservation.Instances?.forEach(instance => {
            freshMachines.push({
                // @ts-ignore
                instanceId: instance.InstanceId,
                // @ts-ignore
                dns: instance.PublicDnsName,
                // @ts-ignore
                ip: instance.PublicIpAddress,
                isUsed: false
            });
        });
    });

    ALL_MACHINES.length = 0;   
    ALL_MACHINES.push(...freshMachines);

    console.log("UPDATED MACHINES:", ALL_MACHINES);
}

await refreshInstances();
// Before starting the server, make sure there is at least 2 machines currently running
// then user can visit our app and get the idle machines instantly
setInterval(async () => {
    await refreshInstances();
}, 10 * 1000);
// every 10 seconds the backend app will go through the machines and check which one are up