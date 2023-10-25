#!/bin/bash

USER="systemd-user"
GROUP="csye6225"

sudo chown -R $USER:$GROUP /etc/environment
sudo chmod 644 /etc/environment

# Source the environment variables from /etc/environment
source /etc/environment

# Change to the directory where your Node.js application is located
cd /opt/dist

# "HOST=$HOST" > .env
# "MYSQLUSER=$MYSQLUSER" >> .env
# "PASSWORD=$PASSWORD" >> .env

# Start your Node.js application using npm
npm run prd-start



