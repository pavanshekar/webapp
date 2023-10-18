#!/bin/bash

set -e

if [ -f .env ]; then
  export $(cat .env | xargs)
fi

sudo apt update 
sudo apt upgrade -y

curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt install -y mariadb-server

printf "%s\nno\nno\nyes\nyes\nyes\nyes\n" "$DB_PASSWORD" | sudo mysql_secure_installation -p$DB_PASSWORD

# Check if we can log in with the given root password
mysql -u root -p"$DB_PASSWORD" -e "exit" || (echo "Failed to login with root password!" && exit 1)

echo "CREATE DATABASE IF NOT EXISTS $DB_DATABASE;" | sudo mariadb
echo "FLUSH PRIVILEGES;" | sudo mariadb

# Check if the database was created
DATABASE_EXISTS=$(mysql -u root -p"$DB_PASSWORD" -e "SHOW DATABASES LIKE '$DB_DATABASE';" | grep "$DB_DATABASE")
if [ -z "$DATABASE_EXISTS" ]; then
    echo "Database $DB_DATABASE does not exist!"
    exit 1
fi

sudo apt install -y unzip

sudo mkdir -p /opt/AssignmentsAPI
sudo unzip /tmp/app.zip -d /opt/AssignmentsAPI
cd /opt/AssignmentsAPI/AssignmentsAPI

sudo npm install

sudo apt-get clean
