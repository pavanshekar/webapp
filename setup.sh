#!/bin/bash

set -e

sudo apt update 
sudo apt upgrade -y

curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt install -y unzip

sudo mkdir -p /var/log/csye6225-logs
sudo chown csye6225:csye6225 /var/log/csye6225-logs
sudo chmod 755 /var/log/csye6225-logs

sudo mkdir -p /opt/AssignmentsAPI
sudo unzip /tmp/app.zip -d /opt/AssignmentsAPI

cd /opt/AssignmentsAPI/AssignmentsAPI

sudo groupadd -f csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/AssignmentsAPI/AssignmentsAPI csye6225 || true

if [ -f .env ]; then
  export $(cat .env | xargs)
fi

echo "PORT=$PORT" | sudo tee -a .env >/dev/null
echo "SECRET_KEY=$SECRET_KEY" | sudo tee -a .env >/dev/null

sudo chown -R csye6225:csye6225 /opt/AssignmentsAPI/AssignmentsAPI
sudo chmod -R 755 /opt/AssignmentsAPI/AssignmentsAPI/

sudo -u csye6225 npm install

sudo cp /tmp/assignments-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start assignments-api
sudo systemctl enable assignments-api

sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb || sudo apt-get install -y -f

sudo mv /tmp/amazon-cloudwatch-agent.json /opt/aws/amazon-cloudwatch-agent.json
sudo chown -R csye6225:csye6225 /opt/aws/amazon-cloudwatch-agent.json
sudo chmod -R 755 /opt/aws/amazon-cloudwatch-agent.json

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent.json -s
sudo systemctl enable amazon-cloudwatch-agent
