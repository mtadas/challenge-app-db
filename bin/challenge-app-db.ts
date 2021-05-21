#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ChallengeAppDbStack } from '../lib/challenge-app-db-stack';
import fs = require('fs');
import yaml = require('js-yaml');

const app = new cdk.App();

const env = {
    account: app.node.tryGetContext('account'),
    region: app.node.tryGetContext('region'),
    branch: app.node.tryGetContext('branch'),
    application: app.node.tryGetContext('application'),
    role: app.node.tryGetContext('role')
};

//Define the stack name
var stack = `${env.application}-${env.role}-${env.branch}`

//Select variables based on the branch
var deployPattern = ''
if (env.branch === 'master'){
    deployPattern = 'prod'
}else {
    deployPattern = 'nonprod'
}

//Read config file
try {
    var fileContents = fs.readFileSync('./conf/config.yaml', 'utf8');
    var data: any = {}
    data = yaml.load(fileContents);
    var config = data.Pattern[deployPattern]
  } catch (err) {
    console.log(err);
  }

var vpcid = config.vpcid
var storageEncrypted = config.storageEncrypted
var multiAz = config.multiAz
var autoMinorVersionUpgrade = config.autoMinorVersionUpgrade
var allocatedStorage = config.allocatedStorage
var backupRetention = config.backupRetention
var deletionProtection = config.deletionProtection
var masterUsername = config.masterUsername
var port = config.port
var preferredBackupWindow = config.preferredBackupWindow
var preferredMaintenanceWindow = config.preferredMaintenanceWindow
var instanceType = config.instanceType


const rdsStack = new ChallengeAppDbStack(app, stack, {
    env: env,
    description: 'Creates RDS instance',
    vpcid: vpcid,
    stackName: stack,
    branchName: env.branch,
    application: env.application,
    instanceType: instanceType,
    sgRules: data.SecurityGroups.rules,
    storageEncrypted: storageEncrypted,
    multiAz: multiAz,
    autoMinorVersionUpgrade: autoMinorVersionUpgrade,
    allocatedStorage: allocatedStorage,
    backupRetention: backupRetention,
    deletionProtection: deletionProtection,
    masterUsername: masterUsername,
    port: port,
    preferredBackupWindow: preferredBackupWindow,
    preferredMaintenanceWindow: preferredMaintenanceWindow

});

// Add dynamic tags
cdk.Tags.of(rdsStack).add('Name', stack)
cdk.Tags.of(rdsStack).add('Application', env.application)
cdk.Tags.of(rdsStack).add('Role', env.role)
cdk.Tags.of(rdsStack).add('Branch', env.branch)

// Add Tags defined in config.conf
data.Tags.forEach((element) => {
    cdk.Tags.of(rdsStack).add( 
    element.name, 
    element.value
    );
});


