#!/bin/bash

set -e

if [ -f .env ]; then
  export $(cat .env | xargs)
fi

sudo apt update 
sudo apt upgrade -y

curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

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

sudo cp ./assignments-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable assignments-api
sudo systemctl start assignments-api