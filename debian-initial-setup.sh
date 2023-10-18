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

# Define your MySQL root password
MYSQL_PASSWORD=root
MYSQL_ROOT_USER=root
DATABASE_NAME=Assignments_Demo_DB

sudo mysql -e "SET PASSWORD FOR root@localhost = PASSWORD('$MYSQL_PASSWORD');FLUSH PRIVILEGES;"

printf "%s\n n\n n\n n\n n\n n\n y\n" "$MYSQL_PASSWORD" | sudo mysql_secure_installation

sudo mysql -e "GRANT ALL PRIVILEGES ON \`${DATABASE}\`.* TO '$MYSQL_ROOT_USER'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';"

mysql -u root -p$MYSQL_PASSWORD -Bse "CREATE DATABASE $DATABASE_NAME;"

mysql -u root -p$MYSQL_PASSWORD -Bse "SHOW DATABASES;"

echo "MySQL setup completed."

sudo apt-get clean
