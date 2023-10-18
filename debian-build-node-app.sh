#!/bin/bash

#!/bin/bash

# Source and destination paths
source_path="/home/admin/webapp.zip"
destination_path="/opt/dist/"

# Check if the source file exists
if [ -f "$source_path" ]; then
  # Create the destination directory if it doesn't exist
  sudo mkdir -p "$destination_path"

  # Move the source zip file to the destination directory
  sudo mv "$source_path" "$destination_path"

  # Navigate to the destination directory
  cd "$destination_path" || exit 1

  # Check if the zip file is in the destination directory
  if [ -f "webapp.zip" ]; then
    # Unzip the zip file
    sudo unzip "webapp.zip"

    # Check if the directory webapp exists
    if [ -d "webapp" ]; then
      # Navigate to the webapp directory
      cd "webapp" || exit 1

      # Run npm install
      sudo npm install
    else
      echo "webapp directory does not exist."
    fi
  else
    echo "webapp.zip does not exist in the destination directory."
  fi
else
  echo "Source file webapp.zip does not exist."
fi


# # Unzip the webapp.zip file
# opt_directory="/home/admin/"

# # Check if the current working directory is "/opt"
# if [ "$PWD" == "$opt_directory" ]; then
#   echo "Already in /home/admin directory."
# else
#   # Change to the /opt directory and check the exit status
#   if cd "$opt_directory"; then
#     echo "Changed to /home/admin directory."
#   else
#     echo "Failed to change to /dest directory."
#     exit 1
#   fi
# fi
# # Unzip the webapp.zip file to /opt directory
# sudo mkdir -p /opt/dist/
# sudo mv /home/admin/webapp.zip /opt/dist/webapp.zip
# # Print the directory structure
# ls -lrth  /opt/dist
# zip_file="/opt/dist/webapp.zip"

# if [ -f "$zip_file" ]; then
#   sudo unzip "$zip_file"
#   if [ -d "/opt/dist/webapp" ]; then
#     cd "/opt/dist/webapp/" || exit
#     sudo npm install
# else
#     echo "Directory /opt/dist/webapp/ does not exist."
# fi
# else
#   echo "webapp.zip does not exist."
# fi