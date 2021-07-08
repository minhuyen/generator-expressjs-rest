import User from '../api/users/users.model';

export const createAdminAccount = async () => {
  const admin = await User.findOne({ email: 'admin@gmail.com' });
  // console.log('======admin======', admin);
  if (!admin) {
    await User.create({
      email: 'admin@gmail.com',
      full_name: 'admin',
      password: 'admin@123',
      role: 'admin'
    });
  } else {
    admin.password = 'admin@123';
    await admin.save();
  }
};
