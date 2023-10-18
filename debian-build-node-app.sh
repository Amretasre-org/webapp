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
ls -lrth  /opt/dist/
zip_file="webapp.zip"

if cd /opt/dist/; then
  sudo unzip -o "$zip_file" 
  echo "File is unzipped"
  
cd webapp/

echo "cd inside the webapp directory"
  if sudo npm install; then
    echo "npm install completed without errors."
  else
    echo "npm install encountered errors."
    exit 1
  fi
else
  echo "Failed to change directory to /opt/webapp. Exiting."
  exit 1
fi
