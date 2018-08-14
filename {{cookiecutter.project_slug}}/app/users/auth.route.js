var express 		= require('express'),
    router 			= express.Router(),
    user 	= require('./index'),
    passport		= require('passport');

router.post('/login', user.login);
router.post('/signup', user.signup);

module.exports = router