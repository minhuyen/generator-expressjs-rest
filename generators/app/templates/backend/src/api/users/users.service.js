import { Service } from '../../helpers/common';
import User from './users.model';
import { logger } from '../../services';

class UserService extends Service {
  constructor(model) {
    super(model);
  }
}

export default new UserService(User);
