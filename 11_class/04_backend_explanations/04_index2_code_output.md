# Input 1

```ts
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
    console.log(data);

}

refreshInstances();
```


# output

```sh
{
  $metadata: {
    httpStatusCode: 200,
    requestId: "0c79fe0b-6180-4516-a353-e689b0508046",
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0,
  },
  AutoScalingInstances: [
    {
      InstanceId: "i-000426e04e19eb925",
      InstanceType: "t2.medium",
      AutoScalingGroupName: "bolt-asg",
      AvailabilityZone: "ap-south-1a",
      LifecycleState: "InService",
      HealthStatus: "HEALTHY",
      LaunchTemplate: [Object ...],
      ProtectedFromScaleIn: false,
    }, {
      InstanceId: "i-06e3536d1cf405b97",
      InstanceType: "t2.medium",
      AutoScalingGroupName: "bolt-asg",
      AvailabilityZone: "ap-south-1a",
      LifecycleState: "InService",
      HealthStatus: "HEALTHY",
      LaunchTemplate: [Object ...],
      ProtectedFromScaleIn: false,
    }
  ],
}
```


---



# Input 2

```ts
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
    
    console.log(ec2Reponse);

}

refreshInstances();
```


# output

```sh
{
  $metadata: {
    httpStatusCode: 200,
    requestId: "670d4061-d84c-4c4a-b720-fd875ea34f68",
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Reservations: [
    {
      ReservationId: "r-0f4ae9882fbb3c0ec",
      OwnerId: "381492183358",
      RequesterId: "968245739290",
      Groups: [],
      Instances: [
        [Object ...]
      ],
    }, {
      ReservationId: "r-0c7145259438e2347",
      OwnerId: "381492183358",
      RequesterId: "968245739290",
      Groups: [],
      Instances: [
        [Object ...]
      ],
    }
  ],
}
```






---



# Input 3

```ts
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

    // @ts-ignore    
    const ec2InstanceCommand = new DescribeInstancesCommand({
        InstanceIds: data.AutoScalingInstances?.map(x=>x.InstanceId)
    })
    const ec2Reponse = await ec2Client.send(ec2InstanceCommand);
    
    // @ts-ignore    
    console.log(ec2Reponse.Reservations[0]?.Instances);
    // this will return a single element array [{...}]
    
}

refreshInstances();

```


# output

```sh
[
  {
    Architecture: "x86_64",
    BlockDeviceMappings: [
      [Object ...]
    ],
    ClientToken: "e5a6686a-0c75-9285-7d6a-4be7f60ce87a",
    EbsOptimized: false,
    EnaSupport: true,
    Hypervisor: "xen",
    NetworkInterfaces: [
      [Object ...]
    ],
    RootDeviceName: "/dev/sda1",
    RootDeviceType: "ebs",
    SecurityGroups: [
      [Object ...]
    ],
    SourceDestCheck: true,
    Tags: [
      [Object ...], [Object ...], [Object ...]
    ],
    VirtualizationType: "hvm",
    CpuOptions: {
      CoreCount: 2,
      ThreadsPerCore: 1,
    },
    CapacityReservationSpecification: {
      CapacityReservationPreference: "open",
    },
    HibernationOptions: {
      Configured: false,
    },
    MetadataOptions: {
      State: "applied",
      HttpTokens: "required",
      HttpPutResponseHopLimit: 2,
      HttpEndpoint: "enabled",
      HttpProtocolIpv6: "disabled",
      InstanceMetadataTags: "disabled",
    },
    EnclaveOptions: {
      Enabled: false,
    },
    BootMode: "uefi-preferred",
    PlatformDetails: "Linux/UNIX",
    UsageOperation: "RunInstances",
    UsageOperationUpdateTime: 2025-10-25T08:36:32.000Z,
    PrivateDnsNameOptions: {
      HostnameType: "ip-name",
      EnableResourceNameDnsARecord: false,
      EnableResourceNameDnsAAAARecord: false,
    },
    MaintenanceOptions: {
      AutoRecovery: "default",
    },
    CurrentInstanceBootMode: "legacy-bios",
    NetworkPerformanceOptions: {
      BandwidthWeighting: "default",
    },
    Operator: {
      Managed: false,
    },
    InstanceId: "i-000426e04e19eb925",
    ImageId: "ami-0147323712070da7c",
    State: {
      Code: 16,
      Name: "running",
    },
    PrivateDnsName: "ip-172-31-45-78.ap-south-1.compute.internal",
    PublicDnsName: "ec2-13-232-185-239.ap-south-1.compute.amazonaws.com",
    StateTransitionReason: "",
    KeyName: "nihar-laptop",
    AmiLaunchIndex: 0,
    ProductCodes: [],
    InstanceType: "t2.medium",
    LaunchTime: 2025-10-25T08:36:32.000Z,
    Placement: {
      GroupName: "",
      Tenancy: "default",
      AvailabilityZone: "ap-south-1a",
    },
    Monitoring: {
      State: "disabled",
    },
    SubnetId: "subnet-0e85832c5e022427d",
    VpcId: "vpc-0d8219a02a0290355",
    PrivateIpAddress: "172.31.45.78",
    PublicIpAddress: "13.232.185.239",
  }
]
```
