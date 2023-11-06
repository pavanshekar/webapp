const winston = require('winston');
const winstonCloudWatch = require('winston-cloudwatch');
 
var options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: true,
  },
};
 
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(options.console),
    new winstonCloudWatch({
      logGroupName: 'csye6225',
      logStreamName: 'webapp',
      awsRegion: 'us-east-2',
      retentionInDays: 1,
    }),
  ],
  exitOnError: false,
});
 
logger.level = 'silly';
 
logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};
 
module.exports = logger;