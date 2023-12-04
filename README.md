# csye6225-Netwrk-Strctrs-Cloud-Cmpting
Organization repo for Networl structures and cloud computing.
test
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

```
export AWS_PROFILE=demo
echo $AWS_PROFILE
export AWS_REGION=us-east-1
echo $AWS_REGION
```

### Command to import
```
sudo chown amretasrerengarajan:staff private.key

aws acm import-certificate --certificate fileb:///Users/amretasrerengarajan/AccessKeysAWS/demo/ssl-demo/demo_donquixote_me.crt \
      --certificate-chain fileb:///Users/amretasrerengarajan/AccessKeysAWS/demo/ssl-demo/demo_donquixote_me.ca-bundle \
      --private-key fileb:///Users/amretasrerengarajan/AccessKeysAWS/demo/ssl-demo/private.key
```


## Packer commands

```
packer fmt packer/aws-ami.pkr.hcl 
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


```
systemctl status Assignment-node-app.service
journalctl -u Assignment-node-app.service

sudo systemctl daemon-reload
sudo systemctl restart Assignment-node-app.service

sudo chown systemd-user:csye6225 /var/log/healthcheck.service/out.log
sudo chmod 644 /var/log/healthcheck.service/out.log
```

### Commands to get the access key and secret access key
```
aws configure get aws_access_key_id --profile <your-profile-name>
aws configure get aws_secret_access_key --profile <your-profile-name>
```

