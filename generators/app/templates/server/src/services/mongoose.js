import mongoose from 'mongoose';
import logger from './logger';

mongoose.Promise = global.Promise;

mongoose.connection.on('error', err => {
  logger.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

mongoose.connection.once('open', function() {
  // we're connected!
  logger.info('Successfully connected to the database');
});

export default mongoose;
