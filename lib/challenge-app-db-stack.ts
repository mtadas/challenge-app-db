import * as cdk from '@aws-cdk/core';
import rds = require('@aws-cdk/aws-rds');
import ec2 = require('@aws-cdk/aws-ec2');
interface environment extends cdk.StackProps {
  vpcid: string,
  stackName: string,
  branchName: string,
  application: string,
  sgRules: any,
  instanceType: ec2.InstanceType,
  storageEncrypted: boolean,
  multiAz: boolean,
  autoMinorVersionUpgrade: boolean,
  allocatedStorage: number,
  backupRetention: number,
  deletionProtection: boolean,
  masterUsername: string,
  port: number,
  preferredBackupWindow: string,
  preferredMaintenanceWindow: string
}
export class ChallengeAppDbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: environment) {
    super(scope, id, props);

    // vpc lookup
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      vpcId: props?.vpcid
    });

    //Create security group
    const rdsSG = new ec2.SecurityGroup (this, 'rds-sg', {
      vpc,
      securityGroupName: `${props?.stackName}-sg`,
      description: 'RDS security group',
      allowAllOutbound: true 
    });

    // Add ingress rules to the SG defined in config.conf
    props?.sgRules.forEach((element) => {
      rdsSG.addIngressRule(
        ec2.Peer.ipv4(element.ip),
        ec2.Port.tcp(element.port),
        element.desc
      );
    });

    //Create RDS Instance
    var rdsInstnace = new rds.DatabaseInstance(this, 'rds-db', {
      engine: rds.DatabaseInstanceEngine.postgres({ 
        version: rds.PostgresEngineVersion.VER_10_7
      }),
      instanceType: props?.instanceType,
      vpc: vpc,
      preferredBackupWindow: props?.preferredBackupWindow,
      preferredMaintenanceWindow: props?.preferredMaintenanceWindow,
      multiAz: props?.multiAz,
      instanceIdentifier: props?.stackName,
      securityGroups: [rdsSG],
      autoMinorVersionUpgrade: props?.autoMinorVersionUpgrade,
      allocatedStorage: props?.allocatedStorage,
      storageType: rds.StorageType.GP2,
      backupRetention: cdk.Duration.days(props?.backupRetention!),
      deletionProtection: props?.deletionProtection,
      port: props?.port
    });

    //Outputs
    new cdk.CfnOutput(this, "RDSEndpoint", {value: rdsInstnace.dbInstanceEndpointAddress});
    new cdk.CfnOutput(this, "vpcId", {value: vpc.vpcId});

  }
}
