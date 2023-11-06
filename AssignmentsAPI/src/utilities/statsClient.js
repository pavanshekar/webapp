const StatsD = require('node-statsd');
const dotenv = require('dotenv');

dotenv.config();

const client = new StatsD({
  host: '127.0.0.1',
  port: 8125,
});

module.exports = client;
