const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorMiddleware = require('./src/middleware/errorMiddleware');
const tokenMiddleware = require('./src/middleware/tokenMiddleware');
const router = require('./src/routes/router');
const { sequelize } = require('./src/utilities/connection');

dotenv.config();

const app = express();

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(tokenMiddleware);

app.use('/vi/assignments', router);

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
        app.use((req, res) => {
            res.status(503).end();
        });
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    });

module.exports = app;
