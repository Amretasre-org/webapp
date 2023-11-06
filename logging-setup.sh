#!/bin/bash

if [ -f /opt/dist/cloudwatch-config.json ]; then
    # Move the file from /opt/dist to /opt
    mv /opt/dist/cloudwatch-config.json /opt/
    echo "Moved cloudwatch-config.json to /opt/"
    
    # List the contents of the /opt directory
    echo "Contents of /opt directory after moving the file:"
    ls /opt
    
    # Now you can run the CloudWatch Agent configuration command
    sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/opt/cloudwatch-config.json \
    -s
else
    echo "The source file /opt/dist/cloudwatch-config.json does not exist."
fi