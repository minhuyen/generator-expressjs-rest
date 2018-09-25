var express 		= require('express'),
    router 			= express.Router(),
    user 	= require('../users/index'),
    passport		= require('passport');

router.post('/login', user.login);
router.post('/signup', user.signup);
router.post('/facebook',
  passport.authenticate('facebook-token'),
  user.loginSocial
);

router.post('/google',
  passport.authenticate('google-token'),
  user.loginSocial
);

module.exports = router