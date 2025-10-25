import { AutoScalingClient, DescribeAutoScalingInstancesCommand, SetDesiredCapacityCommand, TerminateInstanceInAutoScalingGroupCommand } from "@aws-sdk/client-auto-scaling";
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

import express from "express";
const app = express();

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
    })
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

        // await waitForInstancesToBeRunning();
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
            const oldState = ALL_MACHINES.find(m => m.instanceId === instance.InstanceId);
            freshMachines.push({
                // @ts-ignore
                instanceId: instance.InstanceId,
                // @ts-ignore
                dns: instance.PublicDnsName,
                // @ts-ignore
                ip: instance.PublicIpAddress,
                isUsed: oldState ? oldState.isUsed : false
            });
        });
    });

    ALL_MACHINES.length = 0;
    ALL_MACHINES.push(...freshMachines);

    console.log("UPDATED MACHINES:", ALL_MACHINES);
}

await refreshInstances();
setInterval(async () => {
    await refreshInstances();
}, 10 * 1000);


const MAX_ALLOWED_MACHINES = 20; 

async function scaleUp() {
    const idleCount = ALL_MACHINES.filter(x => x.isUsed === false).length;
    let desired = ALL_MACHINES.length + (5 - idleCount);

    if (desired > MAX_ALLOWED_MACHINES) {
        desired = MAX_ALLOWED_MACHINES;
    }

    return await client.send(new SetDesiredCapacityCommand({
        AutoScalingGroupName: "bolt-asg",
        DesiredCapacity: desired
    }));
}


async function scaleDown(machineId: string) {
    const command = new TerminateInstanceInAutoScalingGroupCommand({
        InstanceId: machineId,
        ShouldDecrementDesiredCapacity: true
    })
    return await client.send(command);
}

//@ts-ignore
app.get("/", async (req, res) => {
    // FIX: findOne is NOT a function in JS — must use .find()
    const idleMachine = ALL_MACHINES.find(x => x.isUsed === false);
    
    if (!idleMachine) {
        console.log("⚠ No idle machines — scaling up...");
        await scaleUp();  // WAIT for AWS to accept request
        return res.status(404).send("No idle machines — scaling up now, retry after a few seconds.");
    }
    
    // ✅ Assign this machine as used
    idleMachine.isUsed = true;
    
    // ✅ Try to keep always 5 idle free machines ready
    scaleUp(); // no await needed → fire and forget
    
    return res.status(200).json({
        machineId: idleMachine.instanceId,
        dns: idleMachine.dns,
        ip: idleMachine.ip,
        comment: "Machine is ready — connect on :8080 now."
    });
});

//@ts-ignore
app.get("/destroy/:id", async (req, res) => {
    const machineId: string = req.params.id;

    await scaleDown(machineId);

    return res.json({ message: `Terminated ${machineId} and scaled down.` });
});


app.listen(3000);