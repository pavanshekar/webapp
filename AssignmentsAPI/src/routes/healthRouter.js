const express = require('express');
const router = express.Router();
const logger = require('../utilities/logger');
const statsdClient = require('../utilities/statsClient');

const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff'
};

router.get('/', async (req, res) => {
    statsdClient.increment('health.check.call_count');
    logger.debug('Health check performed');

    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        logger.error('Health check - bad request');
        return res.status(400).set(headers).end();
    }

    res.status(200).set(headers).end();
    logger.info('Health check - success');
});

router.all('/', (req, res) => {
    statsdClient.increment('health.method_not_allowed.call_count');
    logger.error('Method not allowed for health check');
    
    res.status(405).set(headers).end();
});

module.exports = router;
