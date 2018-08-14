let user = require('./user.ctrl').default

module.exports = {
  login: user.login,
  signup: user.signup,
  getUserLoggedInfo: user.getUserLoggedInfo,
  patch: user.patch,
  changePassword: user.changePassword
}