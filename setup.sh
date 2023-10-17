#!/bin/bash

if [ -f .env ]; then
  export $(cat .env | xargs)
fi

sudo apt update 
sudo apt upgrade -y

curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt install -y mariadb-server

printf "%s\nno\nno\nyes\nyes\nyes\nyes\n" "$DB_PASSWORD" | sudo mysql_secure_installation -p$DB_PASSWORD

echo "CREATE DATABASE IF NOT EXISTS $DB_DATABASE;" | sudo mariadb
echo "FLUSH PRIVILEGES;" | sudo mariadb

sudo apt install -y unzip

sudo mkdir -p /opt/AssignmentsAPI
sudo unzip /tmp/app.zip -d /opt/AssignmentsAPI
cd /opt/AssignmentsAPI/AssignmentsAPI

sudo npm install
# node app.js

sudo apt-get clean