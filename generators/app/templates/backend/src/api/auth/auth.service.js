import User from '../users/users.model';
import { logger, jwt, MailService } from '../../services';
import { utils } from '../../helpers';
import { decodeToken } from "../../helpers/utils";
// import deviceTokenService from '../deviceTokens/deviceToken.service';

const signup = async data => {
  const user = await User.create(data);
  const token = jwt.sign(user._id);
  const result = {
    user,
    token
  };
  return result;
};

const login = user => {
  const token = jwt.sign(user._id);
  return { user, token };
};

const logout = async token => {
  // const result = await deviceTokenService.deleteDeviceTokenByToken(token);
  return "";
};

const checkEmailIsValid = async email => {
  const count = await User.countDocuments({ email });
  let result = { isValid: true, message: 'Your email is valid!' };
  if (count > 0) {
    result = { isValid: false, message: 'Your email already exists!' };
  }
  return result;
};

const checkUsernameIsValid = async username => {
  const count = await User.countDocuments({ username });
  let result = { isValid: true, message: 'Your username is valid!' };
  if (count > 0) {
    result = { isValid: false, message: 'Your username already exists!' };
  }
  return result;
};

const forgotPassword = async email => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`User not found with email: ${email}`);
  } else {
    const passcode = utils.randomVerfiedCode();
    user.resetPasswordToken = passcode;
    user.resetPasswordExpires = Date.now() + 360000; // expires in 1 hour
    await user.save();
    const mailService = new MailService();
    mailService.passwordResetEmail(email, passcode);
  }
};

const resetPassword = async (user, password) => {
  user.password = password;
  const result = await user.save();
  return result;
};

const verifyCode = async data => {
  const { code, email } = data;
  const user = await User.findOne({
    resetPasswordToken: code,
    email: email,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    throw new Error('Code is invalid or has expired!');
  } else {
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    const token = jwt.sign(user._id);
    return { user, token };
  }
};

const loginWithApple = async (token) => {
  let decodedToken = decodeToken(token)
  let userDetail = await User.findOne({ email: decodedToken.email })

  if (userDetail) {
    let userToken = jwt.sign(userDetail._id)
    return { user: userDetail, token: userToken }
  } else {
    let newUser = await User.create({
      email: decodedToken.email,
      full_name: decodedToken.email,
      apple: { id: decodedToken.sub, token }
    })

    let userToken = jwt.sign(newUser._id)
    return { user: newUser, token: userToken }
  }
}

export default {
  signup,
  login,
  logout,
  checkEmailIsValid,
  checkUsernameIsValid,
  forgotPassword,
  resetPassword,
  verifyCode,
  loginWithApple
};
