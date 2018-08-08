'use strict';
let jwt 	= require('jwt-simple');

exports.generateToken = function(user, secret){
	var timestamp = new Date().getTime();
	var temp = {
		"id": user.id,
		'first_name': user.first_name,
		'last_name': user.last_name,
		'email': user.email,
		'timestamp': timestamp
	};
	var token = jwt.encode(temp, secret);
	return token;
}