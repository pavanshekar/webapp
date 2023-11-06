const path = require('path');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const logFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: path.join(__dirname, '..', '..', 'logs', 'webapp-AssignmentsAPI-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
});

const logger = createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
    ),
    transports: [
        dailyRotateFileTransport,
        new transports.Console({
            level: 'debug',
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            ),
        }),
    ],
});

module.exports = logger;
