#!/bin/bash

# Load environment variables from the .env file
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Update packages
sudo apt update 
sudo apt upgrade -y

# Install unzip and other necessary packages
sudo apt install -y unzip mariadb-server

# Set up NodeJS using the nodesource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Setup MariaDB
sudo mysql_secure_installation

echo "grant all on *.* to '${DB_USER}'@'localhost' with grant option;" | sudo mariadb
echo "flush privileges;" | sudo mariadb
echo "create database if not exists '${DB_DATABASE}';" | sudo mariadb

# Extract and set up the application
mkdir -p /opt/AssignmentsAPI
unzip /tmp/app.zip -d /opt/AssignmentsAPI
cd /opt/AssignmentsAPI
npm i

# Clean up
sudo apt-get clean
