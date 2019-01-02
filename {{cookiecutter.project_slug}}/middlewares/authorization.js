let passport = require('passport');
let sendJSONResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

exports.authenticate = function (req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, token) => {
    // console.log(token)
    if (err || !token) {
      return sendJSONResponse(res, 401, {
        success: false,
        message: 'Unauthorized'
      })
    }
    req.user = token
    next()
  })(req, res, next);
}
