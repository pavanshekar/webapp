const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorMiddleware = require('./src/middleware/errorMiddleware');
const tokenMiddleware = require('./src/middleware/tokenMiddleware');
const healthRouter = require('./src/routes/healthRouter');
const assignmentsRouter = require('./src/routes/assignmentsRouter');
const { sequelize } = require('./src/utilities/connection');
const logger = require('./src/utilities/logger');

dotenv.config();

const app = express();

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
    try {
        await sequelize.authenticate();
        next();
    } catch (error) {
        logger.error('Database connection error:', error);
        res.status(503).send();
    }
});

app.use('/healthz', healthRouter);
app.use(tokenMiddleware);
app.use('/v1/assignments', assignmentsRouter);
app.use(errorMiddleware);

sequelize
    .authenticate()
    .then(() => {
        logger.info('Database connection established successfully.');
        app.listen(port, () => {
            logger.info(`Server listening on port ${port}`);
        });
    })
    .catch((error) => {
        logger.error('Database connection error:', error);
        app.listen(port, () => {
            logger.info(`Server listening on port ${port}`);
        });
    });

module.exports = app;
