import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';
require('winston-daily-rotate-file');

const env = process.env.NODE_ENV || 'development';
const logDir = 'logs';

// Create  the log directory if it does not exist.
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD'
});

const logger = createLogger({
  level: env === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.label({ label: path.basename(module.parent.filename) }),
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.splat(), // https://nodejs.org/dist/latest/docs/api/util.html#util_util_format_format_args
    format.printf(
      // We display the label text between square brackets using ${info.label} on the next line
      info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    )
  ),
  transports: [
    new transports.Console({
      level: 'info'
    }),
    dailyRotateFileTransport
  ]
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};

export default logger;
