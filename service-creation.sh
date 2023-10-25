#!/bin/bash

APP_NAME="Assignment-node-app"
APP_DIRECTORY="/opt/dist"
# START_COMMAND="npm run prd-start"
USER="systemd-user"
GROUP="csye6225"

# Create a system group
sudo groupadd ${GROUP}

sudo chmod +x /opt/dist/start-app.sh

# Create a system user
sudo useradd --system --shell /bin/false --no-create-home -g $GROUP $USER

sudo mkdir -p /var/log/$APP_NAME.service

cat <<EOF | sudo tee /etc/systemd/system/$APP_NAME.service
[Unit]
Description=$APP_NAME
ConditionPathExists=/opt/dist/
After=network.target

[Service]
Type=simple
EnvironmentFile=-/etc/environment
WorkingDirectory=/opt/dist/
ExecStart=$APP_DIRECTORY/start-app.sh start
ExecStop=$APP_DIRECTORY/start-app.sh stop
Restart=always
User=$USER
Group=$GROUP
Environment=NODE_ENV=production
StandardOutput=file:/var/log/$APP_NAME.service/out.log
StandardError=file:/var/log/$APP_NAME.service/error.log
SyslogIdentifier=csye6225

[Install]
WantedBy=multi-user.target
WantedBy=cloud-init.target
EOF

# Set permissions on the service unit file
sudo chmod 664 "/etc/systemd/system/$APP_NAME.service"
sudo chown $USER:$GROUP /var/log/$APP_NAME.service/
sudo chmod 755 /var/log/$APP_NAME.service/

sudo chown -R $USER:$GROUP /opt/dist
sudo chmod -R 755 /opt/dist
# sudo chown -R $USER:$GROUP /etc/environment
# sudo chmod 644 /etc/environment

sudo systemctl daemon-reload