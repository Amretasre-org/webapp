#!/bin/bash

# Install and configure the CloudWatch Agent using wget
sudo wget https://amazoncloudwatch-agent-us-east-1.s3.us-east-1.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
