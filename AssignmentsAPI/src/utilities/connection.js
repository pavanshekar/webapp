const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const fs = require('fs');
const csv = require('csv-parser');
const { DataTypes } = require('sequelize');
const path = require('path');

dotenv.config();

const sequelize = new Sequelize({
    dialect: 'mariadb',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const User = sequelize.define('User', {
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

User.prototype.verifyCredentials = async function (password) {
    return bcrypt.compare(password, this.password);
};

const Assignment = sequelize.define('Assignment', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 10,
        },
    },
    num_of_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
});

const UserAssignment = sequelize.define('UserAssignment', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    assignmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    authToken: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

UserAssignment.belongsTo(User, { foreignKey: 'userId' });
UserAssignment.belongsTo(Assignment, { foreignKey: 'assignmentId' });

const loadUserAccounts = async () => {
    try {
        const users = [];
        const csvFilePath = path.join(__dirname, '../../opt/users.csv');

        const readStream = fs.createReadStream(csvFilePath);
        const csvParser = csv();
        readStream.pipe(csvParser);

        for await (const row of csvParser) {
            const { first_name, last_name, email, password } = row;

            const existingUser = await User.findOne({ where: { email } });

            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(password, 10);
                users.push({ first_name, last_name, email, password: hashedPassword });
            } else {
                console.log(`User with email ${email} already exists.`);
            }
        }

        if (users.length > 0) {
            await User.bulkCreate(users);
            console.log('User accounts loaded and created successfully.');
        } else {
            console.log('No new user accounts to create.');
        }
    } catch (error) {
        console.error('Error loading user accounts from CSV:', error);
    }
};

sequelize
    .sync({ force: true })
    .then(() => {
        loadUserAccounts();
    })
    .catch((error) => {
        console.error('Database synchronization error:', error);
    });

module.exports = { sequelize, User, Assignment, UserAssignment };
