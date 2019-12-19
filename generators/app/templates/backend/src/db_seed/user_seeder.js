import User from '../api/users/users.model';

export const createAdminAccount = async () => {
  const admin = await User.findOne({ email: 'admin@callmenow.co' });
  // console.log('======admin======', admin);
  if (!admin) {
    await User.create({
      email: 'admin@callmenow.co',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'Admin',
      password: 'admin@123',
      role: 'admin'
    });
  } else {
    admin.password = 'admin@123';
    await admin.save();
  }
};
