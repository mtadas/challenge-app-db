
  
# challenge-app-db  
  
# README  
  
This repository uses AWS CDK to deploy and initialize the RDS database server with Single/MultiAZ deployment.  
* if you branch this repo, GitHub actions will build a new database for your branch.  
  
# BUILD DETAILS  
  
## AWS RDS (Amazon Web Services Relational Database Service)  
  
RDS is a fully managed database service. In this case, fully managed means we don't get admin permission for the server instances or admin to the database software on each server. We can create databases in the RDS instance, and we do get permissions for the created databases. Database instances are automatically backed up and automatically patched and for Production where we have selected Multi-AZ they also automatically fail-over to the good server if there's a hardware or other issue.  
  
We are using RDS to host Postgres Database  
  
Route53 record set points at the listener endpoint and does not require a change in case of a failover.  
  
  
## How Multi-AZ RDS works  
  
Multi-AZ refers to the database being hosted safely in two independent data centers (AZ's). With multi-AZ there is no data replication lag between which means that on failover, no data is lost.  
  
## Access to RDS  
  
Route53 Name: **CloudFormation Output (challenge-app-db-master.RDSEndpoint)**  
  
RDS Password: Can be retrieved from **Secrets Manager**  
  
RDS User name: Can be retrieved from **Secrets Manager**, is set in the ./conf/config.yaml  
  
# Deployment  and Cofing
  
  
### Deploy the stack
  
To initiate the build, aws secret and access key has to be defined in the GitHub secrets.  
Branching off master will trigger a new build following the below naming  
**application-role-branch**  
Build definition can be found  
*.github/workflows/dev.yml*  

### Configuration  
  
Configuration can be found in the **conf/config.yaml** file. It contains AWS RDS/Security Groups/Tags configuration. This config will apply tags to all taggable resources in the stack and set RDS variables based on the deployment pattern  
  
### Variables  
  
AWS credentials must be defined in the GitHub secrets and will be accessed via the GitHub actions file  
```  
  
aws-access-key-id: ${{ secrets.DEV_AWS_ACCESS_KEY_ID }}  
  
aws-secret-access-key: ${{ secrets.DEV_AWS_SECRET_ACCESS_KEY }}  
  
```  
  
The build variables can be declared in the **GitHub actions file** <img src="https://img.icons8.com/fluent/48/000000/github.png"/>  
  
  
```  
  
env:  
  
APPLICATION: challenge-app  
  
ROLE: db  
  
REGION: ap-southeast-2  
  
```  
  
### Cleaning up  
  
Once you've finished using your stack, don't forget to clean up after yourself. The easiest way to delete the CloudFormation stack, just light the fuse!  
**Destroy branch build**![Bomb](https://img.icons8.com/emoji/48/000000/bomb-emoji.png)  

### AWS CDK commands  
  
* `npm run build` compile typescript to js  
  
* `npm run watch` watch for changes and compile  
  
* `npm run test` perform the jest unit tests  
  
* `cdk deploy` deploy this stack to your default AWS account/region  
  
* `cdk diff` compare deployed stack with current state  
  
* `cdk synth` emits the synthesized CloudFormation template
  
# Roadmap  
  
* Move the project to a library  
  
* Add route 53 CNAME creation per build/Branch name  
  
* Add logic for multiple accounts builds  
  
* Add logic to destroy branch builds  
  
  
### Contributing  
  
via Pull Requests.  
  
i.e. clone this repo & create a branch. 