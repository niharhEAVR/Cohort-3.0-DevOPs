import {
    AutoScalingClient,
    SetDesiredCapacityCommand,
    DescribeAutoScalingInstancesCommand,
    TerminateInstanceInAutoScalingGroupCommand
} from "@aws-sdk/client-auto-scaling";
import {
    EC2Client,
    DescribeInstancesCommand
} from "@aws-sdk/client-ec2";
import express from "express";

const app = express();
app.use(express.json());

const region = "ap-south-1";

const client = new AutoScalingClient({
    region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

const ec2Client = new EC2Client({
    region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

type Machine = {
    instanceId: string;
    ip: string;
    isUsed: boolean;
    assignedProject?: string;
};

const ALL_MACHINES: Machine[] = [];

async function refreshInstances() {
    const { AutoScalingInstances } = await client.send(new DescribeAutoScalingInstancesCommand());
    const instanceIds = AutoScalingInstances?.map(x => x.InstanceId).filter(Boolean) ?? [];

    if (instanceIds.length === 0) return;

    const { Reservations } = await ec2Client.send(
        //@ts-ignore
        new DescribeInstancesCommand({ InstanceIds: instanceIds })
    );

    const freshInstances: Machine[] = Reservations?.flatMap(res =>
        res.Instances?.map(inst => ({
            instanceId: inst.InstanceId!,
            ip: inst.PublicIpAddress!,
            isUsed: ALL_MACHINES.find(m => m.instanceId === inst.InstanceId)?.isUsed || false,
            assignedProject: ALL_MACHINES.find(m => m.instanceId === inst.InstanceId)?.assignedProject
        })) ?? []
    ) ?? [];

    // Replace the old list with the updated one
    ALL_MACHINES.length = 0;
    ALL_MACHINES.push(...freshInstances);
    console.log("Refreshed Machines: ", ALL_MACHINES);
}

await refreshInstances();
setInterval(refreshInstances, 10 * 1000);

// Assign a machine to a project
//@ts-ignore
app.get("/:projectID", async (req, res) => {
    const projectId = req.params.projectID;

    const idleMachine = ALL_MACHINES.find(x => x.isUsed === false);
    if (!idleMachine) {
        return res.status(404).json({ error: "No idle machine found" });
    }

    idleMachine.isUsed = true;
    idleMachine.assignedProject = projectId;

    const desiredCapacity = ALL_MACHINES.length + (2 - ALL_MACHINES.filter(x => x.isUsed === false).length);

    await client.send(new SetDesiredCapacityCommand({
        AutoScalingGroupName: "heavrdevs-asg",
        DesiredCapacity: desiredCapacity
    }));

    res.json({ ip: idleMachine.ip, instanceId: idleMachine.instanceId });
});

// Terminate a specific instance
//@ts-ignore
app.post("/destroy", async (req, res) => {
    const machineID: string = req.body.machineID;

    const machine = ALL_MACHINES.find(m => m.instanceId === machineID);
    if (!machine) {
        return res.status(404).json({ error: "Machine not found" });
    }

    await client.send(new TerminateInstanceInAutoScalingGroupCommand({
        InstanceId: machineID,
        ShouldDecrementDesiredCapacity: true
    }));

    // Remove from local list
    const index = ALL_MACHINES.findIndex(m => m.instanceId === machineID);
    if (index !== -1) ALL_MACHINES.splice(index, 1);

    res.json({ success: true, terminated: machineID });
});

app.listen(9092, () => {
    console.log("Server running on http://localhost:9092");
});


// const command = new SetDesiredCapacityCommand({
//     AutoScalingGroupName: "heavrdevs-asg",
//     DesiredCapacity: 0
// });

// const data = await client.send(command);

// console.log(data);