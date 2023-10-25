#!/bin/bash

APP_NAME="Assignment-node-app"
APP_DIRECTORY="/opt/dist"
# START_COMMAND="npm run prd-start"
USER="systemd-user"
GROUP="csye6225"

# Create a system user
sudo useradd --system --shell /bin/false --no-create-home --disabled-login -g $GROUP $USER

cat <<EOF > "/etc/systemd/system/$APP_NAME.service"
[Unit]
Description=$APP_NAME
ConditionPathExists=/opt/dist/
After=cloud-init.service

[Service]
Type=simple
WorkingDirectory=/opt/dist/
ExecStart=$APP_DIRECTORY/start-app.sh start
ExecStop=$APP_DIRECTORY/start-app.sh stop
Restart=always
User=$USER
Group=$GROUP
Environment=NODE_ENV=production
StandardOutput=file:/var/log/healthcheck.service/out.log
StandardError=file:/var/log/healthcheck.service/error.log
SyslogIdentifier=csye6225

[Install]
WantedBy=multi-user.target
EOF

# Set permissions on the service unit file
chmod 664 "/etc/systemd/system/$APP_NAME.service"



systemctl enable $APP_NAME
systemctl start $APP_NAME
