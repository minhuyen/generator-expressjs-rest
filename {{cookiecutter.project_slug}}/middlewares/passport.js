"use strict";
var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  GoogleTokenStrategy = require('passport-google-token').Strategy,
  FacebookTokenStrategy = require('passport-facebook-token');

// load up the user model
var User = require('../app/users/user.model');
var config = require('../config/index');
// load the auth variables
// var config = require('../config/auth');
var logger = require('./logger');
var util = require('util');
var _ = require('lodash');

module.exports = function (passport) {

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // JWT
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("Bearer");
  opts.secretOrKey = config.mongodb.secret;
  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.id })
      .select('-password -facebook -google -token -braintree_customer_id ')
      .exec(function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
  }));

  passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    profileFields: ['id', 'first_name', 'last_name', 'email', 'picture']
  }, function (accessToken, refreshToken, profile, done) {
    // asynchronous
    process.nextTick(function () {
      profile = profile["_json"];
      // logger.info("========profile========", profile);
      // find the user in the database based on their facebook id
      User.findOne({ 'email': profile.email }, function (err, user) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);

        // if the user is found, then log them in
        if (user) {
          if (user.avatar) {
            return done(null, user); // user found, return that user
          } else {
            user.avatar = util.format('http://graph.facebook.com/%s/picture?type=large', profile.id);
            user.save(function (err, data) {
              if (err)
                throw err;

              // if successful, return the user
              return done(null, data);
            });
          }

        } else {
          // if there is no user found with that facebook id, create them
          var newUser = new User();

          // set all of the facebook information in our user model
          newUser.facebook.id = profile.id;
          newUser.facebook.token = accessToken;
          newUser.first_name = profile.first_name;
          newUser.last_name = profile.last_name;
          newUser.email = profile.email;
          newUser.avatar = util.format('http://graph.facebook.com/%s/picture?type=large', profile.id);
          var new_user = _.assign(newUser, { 'new': true });
          console.log("new User:", new_user);
          // new_user.new = true;
          // save our user to the database
          newUser.save(function (err) {
            if (err) {
              throw err;
            }
            // if successful, return the new user
            return done(null, new_user);
          });
        }

      });
    });
  }));

  passport.use(new GoogleTokenStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret
  }, function (accessToken, refreshToken, profile, done) {
    // logger.info("=========profile============: ", profile);
    process.nextTick(function () {
      profile = profile["_json"];
      // logger.info("=========profile============: ", profile);
      // find the user in the database based on their facebook id
      User.findOne({ 'email': profile.email }, function (err, user) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);

        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newUser = new User();

          // set all of the facebook information in our user model
          newUser.google.id = profile.id;
          newUser.google.token = accessToken;
          newUser.first_name = profile.given_name;
          newUser.last_name = profile.family_name;
          newUser.email = profile.email;
          newUser.avatar = profile.picture
          var new_user = _.assign(newUser);

          // save our user to the database
          newUser.save(function (err) {
            if (err)
              throw err;

            // if successful, return the new user
            return done(null, new_user);
          });
        }

      });
    });
  }));
};
