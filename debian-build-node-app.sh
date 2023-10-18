#!/bin/bash

# Unzip the webapp.zip file
opt_directory="/home/admin/"

# Check if the current working directory is "/opt"
if [ "$PWD" == "$opt_directory" ]; then
  echo "Already in /home/admin directory."
else
  # Change to the /opt directory and check the exit status
  if cd "$opt_directory"; then
    echo "Changed to /home/admin directory."
  else
    echo "Failed to change to /dest directory."
    exit 1
  fi
fi
# Unzip the webapp.zip file to /opt directory
sudo mkdir -p /opt/dist/
sudo mv /home/admin/webapp.zip /opt/dist/webapp.zip
# Print the directory structure
ls -lrth  /opt/dist
zip_file="/opt/dist/webapp.zip"

if [ -f "$zip_file" ]; then
  sudo unzip "$zip_file"
  if [ -d "/opt/dist/webapp" ]; then
    cd "/opt/dist/webapp/" || exit
    sudo npm install
else
    echo "Directory /opt/dist/webapp/ does not exist."
fi
else
  echo "webapp.zip does not exist."
fi