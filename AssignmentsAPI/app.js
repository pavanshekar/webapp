const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorMiddleware = require('./src/middleware/errorMiddleware');
const tokenMiddleware = require('./src/middleware/tokenMiddleware');
const healthRouter = require('./src/routes/healthRouter');
const assignmentsRouter = require('./src/routes/assignmentsRouter');
const { sequelize } = require('./src/utilities/connection');

dotenv.config();

const app = express();

const port = process.env.PORT || 8080;

if(process.env.DB_DATABASE == "AssignmentsDb"){
    console.log("Db accessible!!!");
}

if(process.env.DB_USER == "root"){
    console.log("User ");
}

if(process.env.DB_HOST == "localhost"){
    console.log("Host: ");
}

if(process.env.DB_PASSWORD == "pavan"){
    console.log("Pwd: ");
}

if(process.env.DB_PORT == "3306"){
    console.log("DB-PORT");
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
    try {
        await sequelize.authenticate();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(503).send();
    }
});

app.use('/healthz', healthRouter);
app.use(tokenMiddleware);
app.use('/vi/assignments', assignmentsRouter);
app.use(errorMiddleware);

sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    });

module.exports = app;
