import { Controller } from '../../helpers/common';
import userService from './users.service';
import { handleResponse } from '../../helpers';

class UserController extends Controller {
  constructor(service, name) {
    super(service, name);
    this.updateMe = this.updateMe.bind(this)
    this.getMe = this.getMe.bind(this)
    this.changePassword = this.changePassword.bind(this)
  }

  async changePassword(req, res, next) {
    try {
      const user = req.user;
      const { currentPassword, newPassword } = req.body;
      const result = await this.service.handleChangePassword(
        user,
        currentPassword,
        newPassword
      );
      return handleResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req, res, next) {
    try {
      let result = await this.service.handleUpdateMe(req.user._id, req.body)

      return handleResponse.success(res, result)
    } catch (e) {
      next(e)
    }
  }

  async getMe(req, res, next) {
    try {
      let result = await this.service.handleGetMe(req.user)

      return handleResponse.success(res, result)
    } catch (e) {
      next(e)
    }
  }
}

export default new UserController(userService, 'User');
