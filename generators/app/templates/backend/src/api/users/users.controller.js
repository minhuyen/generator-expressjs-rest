import httpStatus from 'http-status';
import logger from '../../services/logger';
import { Controller } from '../../helpers/common';
import userService from './users.service';
import { handleResponse } from '../../helpers';

class UserController extends Controller {
  constructor(service, name) {
    super(service, name);
  }
}

export default new UserController(userService, 'User');
