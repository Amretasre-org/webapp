# csye6225-Netwrk-Strctrs-Cloud-Cmpting
Organization repo for Networl structures and cloud computing.

Command to copy the zip file to server
scp -i .ssh/digitalocean CSYE6225/csye6225-Netwrk-Strctrs-Cloud-Cmpting.zip root@ip:CSYE6225

scp -i .ssh/digitalocean csye6225-Netwrk-Strctrs-Cloud-Cmpting.zip root@161.35.96.4:/opt

find / -name "csye6225-Netwrk-Strctrs-Cloud-Cmpting.zip”

```
sudo apt update

sudo apt install unzip

sudo apt install mariadb-server

sudo apt install nodejs

sudo apt-get install npm

sudo apt install mariadb-server

mysql -u root -e "CREATE DATABASE Assignments_Demo_DB;"

sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';"

sudo mysql -e "FLUSH PRIVILEGES;"
```

```
unzip csye6225-Netwrk-Strctrs-Cloud-Cmpting.zip
ls -al
```


## Packer commands

```
packer fmt .
packer validate packer/aws-ami.pkr.hcl
export AWS_PROFILE=ami-creation
packer build packer/aws-ami.pkr.hcl 
```

### Command to find the AWS account ID

```
aws sts get-caller-identity --profile profile_name
```

### Commands to run when ssh to ec2

```
chmod 400 pem_file_name
ssh -i pem_file_name admin@ip_add
cd /opt/webapp
```

