'use strict';
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var mongoose = require('mongoose');
var helmet = require('helmet');
var passport = require('passport');
var path = require('path');
var paginate = require('express-paginate');
var config = require('./config/database'); // get db config file

// var User        = require('./models/user'); // get the mongoose model
var port = process.env.PORT || 3000;
var base_api = "/api/v1";
var fs = require('fs');
var cors = require('cors') // call the cors to fix access control bug.

var logger = require("./config/logger");

logger.info('Hello distributed log files!');
logger.info('Hello again distributed logs');
logger.debug('Now my debug messages are written to console!');

// connect to database
mongoose.Promise = require('bluebird'); //global.Promise;
mongoose.connect(config.database);

app.use(cors());
app.use(expressValidator());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
  //use morgan to log at command line
  // app.use(morgan('tiny')); //'combined' outputs the Apache style LOGs
  app.use(morgan('tiny', { "stream": logger.stream }));
}
// security
app.use(helmet());
// log to console
// app.use(morgan('dev'));
// app.use(morgan({ "stream": logger.stream }));

// Use the passport package in our application
app.use(passport.initialize());

// Use paginate express
// keep this before all routes that will use pagination
app.use(paginate.middleware(10, 50)); // limit=10,  maxLimit=50

// pass passport for configuration
require('./config/passport')(passport);

// ROUTES FOR OUR API
// =============================================================================

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email', 'user_friends'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("google: ", req.user);
    res.redirect('/');
  });

// more routes for our API will happen here
let auth = require('./app/users/auth.route');
let user = require('./app/users/user.route');
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use(base_api + '/auth', auth);
app.use(base_api + '/users', user);
// START THE SERVER
// =============================================================================
app.listen(port);
logger.info('Magic happens on port ' + port);

module.exports = app; // for testing
