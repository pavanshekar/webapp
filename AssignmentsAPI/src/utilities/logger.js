const winston = require('winston');
const winstonCloudWatch = require('winston-cloudwatch');
const fs = require('fs');
const path = require('path');

const logDir = path.resolve(__dirname, '..', '..', 'logs');
const logFilePath = path.join(logDir, 'csye6225.log');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true }); 
}

const fileFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ssZ'
    }),
    winston.format.printf(info => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
    })
);

var options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
    file: {
        level: 'debug',
        filename: logFilePath,
        handleExceptions: true,
        json: false,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
        format: fileFormat,
    },
};

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(options.console),
        new winston.transports.File(options.file),
        new winstonCloudWatch({
            logGroupName: 'csye6225',
            logStreamName: 'webapp',
            awsRegion: 'us-east-2',
            jsonMessage: false,
            retentionInDays: 1
        })
    ],
    exitOnError: false,
});

logger.level = 'silly';

logger.stream = {
    write: function (message, encoding) {
        logger.info(message.trim());
    },
};

module.exports = logger;
