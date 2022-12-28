import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';
require('winston-daily-rotate-file');

const fileEnvs = ['production', 'development'];
const env = process.env.NODE_ENV || 'development';
const logDir = 'logs';

// Create  the log directory if it does not exist.
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: 'info',
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
      level: env === 'development' ? 'info' : 'error',
      // format: format.simple(),
    })
  ]
});

if (fileEnvs.includes(env)) {
  logger.add(
    new transports.DailyRotateFile({
      filename: `${logDir}/%DATE%-combined.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  );
  logger.add(
    new transports.DailyRotateFile({
      filename: `${logDir}/%DATE%-error.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error'
    })
  );
}


// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};

export default logger;
