var passport		= require('passport');

exports.authenticate = function() {
	return passport.authenticate('jwt', { session: false });
}