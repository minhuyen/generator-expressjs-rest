import config from '../config';
import User from '../api/users/users.model';

export const createAdminAccount = async () => {
  const defaultEmail = config.admin.email;
  const defaultPassword = config.admin.password;
  const admin = await User.findOne({ email: defaultEmail });
  // console.log('======admin======', admin);
  if (!admin) {
    await User.create({
      email: defaultEmail,
      fullName: 'admin',
      password: defaultPassword,
      role: 'admin'
    });
  } else {
    admin.password = defaultPassword;
    await admin.save();
  }
};
