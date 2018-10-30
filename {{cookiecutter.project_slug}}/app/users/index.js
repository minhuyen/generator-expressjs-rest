let user = require('./user.ctrl')

module.exports = {
  login: user.login,
  signup: user.signup,
  getUserLoggedInfo: user.getUserLoggedInfo,
  patch: user.patch,
  changePassword: user.changePassword,
  loginSocial: user.loginSocial
}
