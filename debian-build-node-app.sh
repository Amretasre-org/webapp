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
sudo mkdir -p /opt/
sudo mv /home/admin/webapp.zip /opt/webapp.zip
cd /opt/ || exit
# Print the directory structure
ls -R /opt/

zip_file="/opt/webapp.zip"

# Check if the ZIP file exists
if [ -f "$zip_file" ]; then
  # Unzip the file to the specified destination folder
  unzip "$zip_file" 
else
  echo "ZIP file not found: $zip_file"
fi

# sudo unzip webapp.zip

# Change directory to the unzipped webapp directory, exit if cd fails
# if cd webapp; then

#   echo "HOST=127.0.0.1" > .env
# 	echo "MYSQLUSER=root" >> .env
#   echo "PASSWORD=soumya6225" >> .env
  
#   # Run npm install
#   echo "cd inside the webapp directory"
#   if sudo npm i; then
#     echo "npm install completed without errors."
#   else
#     echo "npm install encountered errors."
#     exit 1
#   fi
# else
#   echo "Failed to change directory to /webapp. Exiting."
#   exit 1
# fi