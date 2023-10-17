#!/bin/bash
set -e

if [ -f .env ]; then
  export $(cat .env | xargs)
fi

echo "DB_USER: $DB_USER"
echo "DB_PASSWORD: $DB_PASSWORD"
echo "DB_DATABASE: $DB_DATABASE"

sudo apt update 
sudo apt upgrade -y

curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt install -y mariadb-server

printf "%s\nno\nno\nyes\nyes\nyes\nyes\n" "$DB_PASSWORD" | sudo mysql_secure_installation -p$DB_PASSWORD

sudo mysql -u root -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_DATABASE;"

sudo apt install -y unzip

sudo mkdir -p /opt/AssignmentsAPI
sudo unzip /tmp/app.zip -d /opt/AssignmentsAPI
cd /opt/AssignmentsAPI/AssignmentsAPI

sudo npm install
node app.js

sudo apt-get clean