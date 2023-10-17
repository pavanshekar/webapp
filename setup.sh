#!/bin/bash
set -e

if [ -f .env ]; then
  export $(cat .env | xargs)
fi

sudo apt update 
sudo apt upgrade -y
sudo apt install -y unzip mariadb-server

curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY '${DB_PASSWORD}';" | sudo mariadb
echo "CREATE DATABASE IF NOT EXISTS ${DB_DATABASE};" | sudo mariadb
echo "GRANT ALL PRIVILEGES ON ${DB_DATABASE}.* TO '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';" | sudo mariadb
echo "FLUSH PRIVILEGES;" | sudo mariadb

sudo mkdir -p /opt/AssignmentsAPI
sudo unzip /tmp/app.zip -d /opt/AssignmentsAPI
cd /opt/AssignmentsAPI/AssignmentsAPI

sudo npm install
node app.js

sudo apt-get clean
