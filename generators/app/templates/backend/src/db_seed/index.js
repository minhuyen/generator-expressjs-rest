import config from '../config';
import { mongoose, logger } from '../services';
import { createAdminAccount } from './user_seeder';
import User from '../api/users/users.model';

(async () => {
  try {
    logger.info('=======seeding data===========');
    await mongoose.connect(config.mongodb.url, config.mongodb.options);
    await createAdminAccount();
    await User.syncIndexes();
    logger.info('=======seeded data was successfully===========');
  } catch (error) {
    logger.error('==============error==========%j', error);
  }
})();
