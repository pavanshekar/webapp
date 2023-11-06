const express = require('express');
const router = express.Router();
const statsdClient = require('../utilities/statsClient');

const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff'
};

router.get('/', async (req, res) => {
    statsdClient.increment('health.check.call_count');

    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        return res.status(400).set(headers).end();
    }

    res.status(200).set(headers).end();

});

router.all('/', (req, res) => {
    statsdClient.increment('health.method_not_allowed.call_count');
    
    res.status(405).set(headers).end();
});

module.exports = router;
