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

sudo mysql -u root <<-EOF
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('$DB_PASSWORD');
FLUSH PRIVILEGES;
EOF

mysql -u root -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_DATABASE;"

sudo apt install -y unzip

sudo mkdir -p /opt/AssignmentsAPI
sudo unzip /tmp/app.zip -d /opt/AssignmentsAPI
cd /opt/AssignmentsAPI/AssignmentsAPI

echo "PORT=$PORT" | sudo tee -a .env >/dev/null
echo "DB_HOST=$DB_HOST" | sudo tee -a .env >/dev/null
echo "DB_PORT=$DB_PORT" | sudo tee -a .env >/dev/null
echo "DB_USER=$DB_USER" | sudo tee -a .env >/dev/null
echo "DB_PASSWORD=$DB_PASSWORD" | sudo tee -a .env >/dev/null
echo "DB_DATABASE=$DB_DATABASE" | sudo tee -a .env >/dev/null
echo "SECRET_KEY=$SECRET_KEY" | sudo tee -a .env >/dev/null

sudo npm install

sudo node app.js

sudo apt-get clean
