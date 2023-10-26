#!/bin/bash

set -e

sudo apt update 
sudo apt upgrade -y

curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

node -v
npm -v

sudo apt install -y unzip

sudo mkdir -p /opt/AssignmentsAPI
sudo unzip /tmp/app.zip -d /opt/AssignmentsAPI

cd /opt/AssignmentsAPI/AssignmentsAPI

sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/AssignmentsAPI/AssignmentsAPI -m csye6225

if [ -f .env ]; then
  export $(cat .env | xargs)
fi

echo "PORT=$PORT" | sudo tee -a .env >/dev/null
echo "SECRET_KEY=$SECRET_KEY" | sudo tee -a .env >/dev/null

sudo chown -R csye6225:csye6225 /opt/AssignmentsAPI/AssignmentsAPI
sudo chmod -R 755 /opt/AssignmentsAPI/AssignmentsAPI/

sudo mkdir -p node_modules
sudo chown csye6225:csye6225 node_modules
npm install

sudo cp /tmp/assignments-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start assignments-api
sudo systemctl enable assignments-api
