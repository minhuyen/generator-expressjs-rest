import User from '../users/users.model';
import { logger, jwt, MailService } from '../../services';
import { utils } from '../../helpers';
import { decodeToken } from "../../helpers/utils";
// import deviceTokenService from '../deviceTokens/deviceToken.service';
import userService from '../users/users.service';
import refreshTokenService from '../refreshTokens/refreshToken.service';

const signup = async data => {
  const user = await User.create(data);
  const token = generateToken(user);
  const refreshToken = jwt.refreshSign(user._id);
  const result = {
    user,
    token,
    refreshToken
  };
  return result;
};

const login = async (user, ipAddress) => {
  const token = generateToken(user);
  const refreshToken = await generateRefreshToken(user, ipAddress);
  return { user, token, refreshToken: refreshToken.token };
};

const logout = async token => {
  // const result = await deviceTokenService.deleteDeviceTokenByToken(token);
  return { message: "Logout was successfully" };
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
    const passcode = utils.randomVerifiedCode();
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
    const token = generateToken(user);
    return { token };
  }
};

const loginWithApple = async (appleToken, ipAddress) => {
  let decodedToken = await decodeToken(token)
  let user = await User.findOne({ email: decodedToken.email })

 if (!user) {
    user = await User.create({
      email: decodedToken.email,
      full_name: decodedToken.email,
      apple: { id: decodedToken.sub, token }
    });
  }
  const token = generateToken(user);
  const refreshToken = await generateRefreshToken(user, ipAddress);
  return { user, token, refreshToken: refreshToken.token };
}

const refreshToken = async (token, ipAddress) => {
  const refreshToken = await refreshTokenService.findOne({
    token: token
  });
  if (refreshToken) {
    const user = await userService.findById(refreshToken.user);
    const newToken = generateToken(user);
    const newRefreshToken = await generateRefreshToken(user, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    return { user, token: newToken, refreshToken: newRefreshToken.token };
  } else {
    throw new Error('The refresh token is invalid!');
  }
};

const generateToken = user => {
  return jwt.sign({
    uid: user._id,
    role: user.role
  });
};

const generateRefreshToken = async (user, ipAddress) => {
  const refreshToken = jwt.refreshSign(user._id);
  // save the token
  return await refreshTokenService.create({
    user: user._id,
    token: refreshToken,
    // expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress
  });
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
