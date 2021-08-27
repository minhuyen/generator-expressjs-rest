import User from '../users/users.model';
import { logger, jwt, MailService } from '../../services';
import { utils } from '../../helpers';
import { decodeToken } from "../../helpers/utils";
// import deviceTokenService from '../deviceTokens/deviceToken.service';
import userService from '../users/users.service';

const signup = async data => {
  const user = await User.create(data);
  const token = jwt.sign({
    uid: user._id,
    role: user.role
  });
  const refreshToken = jwt.refreshSign(user._id);
  const result = {
    user,
    token,
    refreshToken
  };
  return result;
};

const login = async user => {
  const userId = user._id
  const token = jwt.sign({
    uid: userId,
    role: user.role
  });
  const refreshToken = jwt.refreshSign(userId);
  // save the token
  await userService.update(userId, { refreshToken });

  return { user, token, refreshToken };
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

const refreshToken = async token => {
  const user = await userService.findOne({ refreshToken: token });
  if (user) {
    const newToken = jwt.sign({
      uid: user._id,
      role: user.role,
      role_code: user.role_code
    });
    return { user, token: newToken, refreshToken: token };
  } else {
    throw new Error('The refresh token is invalid!');
  }
};

export default {
  signup,
  login,
  logout,
  checkEmailIsValid,
  checkUsernameIsValid,
  forgotPassword,
  resetPassword,
  verifyCode,
  loginWithApple,
  refreshToken
};
