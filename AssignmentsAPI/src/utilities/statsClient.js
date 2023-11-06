const StatsD = require('node-statsd');
const dotenv = require('dotenv');

dotenv.config();

const client = new StatsD({
  host: process.env.DB_HOST,
  port: 8125,
});

module.exports = client;
