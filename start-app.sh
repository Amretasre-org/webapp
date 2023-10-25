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

# cd /opt/dist
# npm start &
# PID=$!      # This saves the process ID of the last background process

# # Now, you can use a delay or a script to check when your process is "ready"
# sleep 5  

# # Now you'll stop the previous process
# kill $PID

# # You should ideally check here to make sure the process has stopped
# npm start   # This starts the process again, presumably in the foreground


