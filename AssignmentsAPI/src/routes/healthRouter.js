const express = require('express');
const router = express.Router();

const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff'
};

router.get('/', async (req, res) => {

    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        return res.status(400).set(headers).end();
    }

    res.status(200).set(headers).end();

});

router.all('/', (req, res) => {
    res.status(405).set(headers).end();
});

module.exports = router;
