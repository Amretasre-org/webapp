#!/bin/bash

# Update the package list
sudo apt update

# Install unzip
sudo apt install -y unzip

# Install MariaDB Server
sudo apt install -y mariadb-server

# Install Node.js and npm
sudo apt install -y nodejs
sudo apt-get install -y npm

# Load environment variables from .env file
# shellcheck disable=SC1091
if [ -f .env ]; then
  source .env
else
  echo "Error: .env file not found."
  exit 1
fi

# Define your MySQL root password
MYSQL_ROOT_PASSWORD="$PASSWORD"
SQLUSER="$MYSQLUSER"
HOST_NAME="$HOST"

# Echo env variables
echo "HOST environment variable: $HOST_NAME"
echo "MYSQLUSER environment variable: $SQLUSER"
echo "Password variable: $MYSQL_ROOT_PASSWORD"

# Check if the database exists before creating it
if ! mysql -u root -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'Assignments_Demo_DB'" | grep -q "Assignments_Demo_DB"; then
    mysql -u root -e "CREATE DATABASE Assignments_Demo_DB;"
fi

# Create MySQL user and grant privileges
mysql -u root -e "CREATE USER '$SQLUSER'@'$HOST_NAME' IDENTIFIED BY '$MYSQL_ROOT_PASSWORD';"
mysql -u root -e "GRANT ALL PRIVILEGES ON *.* TO '$SQLUSER'@'$HOST_NAME';"
mysql -u root -e "FLUSH PRIVILEGES;"

echo "MySQL setup completed."

exit

