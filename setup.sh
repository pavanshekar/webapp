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

# Logging into MariaDB and changing the root password
sudo mysql -u root <<-EOF
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('$DB_PASSWORD');
FLUSH PRIVILEGES;
EOF

# Check if we can log in with the given root password
mysql -u root -p"$DB_PASSWORD" -e "exit" || echo "Failed to login with root password!"

# Create the database
mysql -u root -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_DATABASE;"

# Check if the database was created
DATABASE_EXISTS=$(mysql -u root -p"$DB_PASSWORD" -e "SHOW DATABASES LIKE '$DB_DATABASE';" | grep "$DB_DATABASE")
if [ -z "$DATABASE_EXISTS" ]; then
    echo "Database $DB_DATABASE does not exist!"
fi

sudo apt install -y unzip

sudo mkdir -p /opt/AssignmentsAPI
sudo unzip /tmp/app.zip -d /opt/AssignmentsAPI
cd /opt/AssignmentsAPI/AssignmentsAPI

sudo npm install

sudo apt-get clean
