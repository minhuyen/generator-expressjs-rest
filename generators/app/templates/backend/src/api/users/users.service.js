import { Service } from '../../helpers/common';
import User from './users.model';
import { logger } from '../../services';

class UserService extends Service {
  constructor(model) {
    super(model);
  }

  async handleChangePassword(user, currentPassword, newPassword) {
    const verifyPassword = user.toJSON().hasPassword ? user.verifyPassword(currentPassword) : 'social'

    if (!verifyPassword) {
      throw new Error('Incorrect Password')
    } else {
      user.password = newPassword;
      return user.save();
    }
  }

  async handleUpdateMe(userId, data) {
    return await User.findByIdAndUpdate(userId, data, { new: true })
  }

  async handleGetMe(user) {
    return { ...user.toJSON() }
  }
}

export default new UserService(User);
