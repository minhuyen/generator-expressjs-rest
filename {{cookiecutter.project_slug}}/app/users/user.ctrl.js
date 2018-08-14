"use strict";
let Users = require('./user.model'),
    HTTPStatus = require('../../helpers/lib/http_status'),
    config = require('../../config/database'), // get db config file
    utils = require('../../helpers/lib/utils');

let bcrypt = require('bcrypt');

let sendJSONResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

const signup = function (req, res) {
  req.checkBody("full_name", "Full name should not be empty !").notEmpty();
  req.checkBody("email", "Email should not be empty !").notEmpty();
  req.checkBody("password", "Password should not be empty").notEmpty();
  req.checkBody("password", "Password should has 6 character as least !").isLength({min: 6});
  req.checkBody("email", "Email is invalid").isEmail();

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      var error = result.useFirstErrorOnly().array()[0].msg;
      return res.status(HTTPStatus.BAD_REQUEST).json({
        success: false,
        message: error
      });
    }
    else {
      let newUser = new Users(req.body);

      let query = {
        email: req.body.email
      }

      Users.findOne(query, function (err, results) {
        // logger.info('---------- ', results)
        if (err) {
          return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
            success: false,
            message: err
          })
        }
        if (results) {
          return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
            success: false,
            message: "This email is already exist in our system !"
          })
        }
        else {
          newUser.save(function (err, user) {
            if (err) {
              return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                success: false,
                message: err
              })
            }
            else {
              let token = utils.generateToken(user, config.secret);
              user.token = 'Bearer ' + token;
              user.save();
              return sendJSONResponse(res, HTTPStatus.CREATED, {
                success: true,
                message: 'Created User Successfully!',
                token: 'Bearer ' + token
              })
              // generateReferCode().then(code => {
              //   user.referCode = code;
              //   let token = utils.generateToken(user, config.secret);
              //   user.token = 'Bearer ' + token;
              //   user.save();
              //   return sendJSONResponse(res, HTTPStatus.CREATED, {
              //     success: true,
              //     message: 'Created User Successfully!',
              //     token: 'Bearer ' + token,
              //     role: user.role,
              //     hasPhoneNumber: !!user.phone_number
              //   })
              // })
            }
          });
        }

      })

    }
  })

};

const login = function (req, res) {
  Users.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      return sendJSONResponse(res, HTTPStatus.INTERNAL_SERVER_ERROR, {
        success: false,
        message: err
      })
    }

    if (!user) {
      return sendJSONResponse(res, HTTPStatus.UNAUTHORIZED, {
        success: false,
        message: 'Invalid Email or Password'
      })
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = utils.generateToken(user, config.secret);
          user.token = 'Bearer ' + token;
          user.save();

          // return the information including token as JSON
          return sendJSONResponse(res, HTTPStatus.OK, {
            success: true,
            token: 'Bearer ' + token,
            role: user.role,
            _id: user._id,
            data: user
          })
        } else {
          return sendJSONResponse(res, HTTPStatus.UNAUTHORIZED, {
            success: false,
            message: 'Invalid Email or Password'
          })
        }
      });
    }
  });
};

const getUserLoggedInfo = (req, res) => {
  if (!req.user._id)
    return sendJSONResponse(res, HTTPStatus.UNAUTHORIZED, {
      success: false,
      message: 'Unauthorized'
    })
  else {
    Users.findById(req.user._id, (err, user) => {
      if (err)
        return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
          success: false,
          message: err
        })
      sendJSONResponse(res, HTTPStatus.OK, {
        success: true,
        message: 'Find User Successfully!',
        data: user
      })
    })
  }
}

const patch = (req, res) => {
  // logger.info('> User: ', req.user)
  if (!req.user._id)
    return sendJSONResponse(res, HTTPStatus.UNAUTHORIZED, {
      success: false,
      message: 'Unauthorized'
    })
  else {
    if (req.body.email)
      return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
        success: false,
        message: 'Email can not be changed'
      })
    if (req.body.password)
      return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
        success: false,
        message: 'Bad request'
      })
    if (req.body.phone_number)
      return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
        success: false,
        message: 'Phone number can not be changed'
      })
    Users.findByIdAndUpdate(req.user._id, {$set: req.body}, {new: true}, function (err, user) {
      if (err) {
        return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
          success: false,
          message: err
        })
      }
      if (user) {
        return sendJSONResponse(res, HTTPStatus.OK, {
          success: true,
          message: 'Updated User Successfully!',
          data: user
        })
      }
    });
  }
}

const changePassword = function (req, res) {
  if (!req.user._id)
    return sendJSONResponse(res, HTTPStatus.UNAUTHORIZED, {
      success: false,
      message: 'Unauthorized'
    })

  req.checkBody("old_password", "Old password should not be empty").notEmpty();
  req.checkBody("new_password", "New password should not be empty").notEmpty();
  req.checkBody("new_password", "New password should has more than 6 character").isLength({min: 6, max: 100});

  var data = req.body;
  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      var error = result.useFirstErrorOnly().array()[0].msg;
      return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
        success: false,
        message: error
      })

    }
    else {
      Users.findOne({_id: req.user._id}, function (err, user) {
        if (user) {
          var hash = user.password;
          bcrypt.compare(data.old_password, hash, function (err, match) {
            if (match) {
              var newHash = bcrypt.hashSync(data.new_password, 10);
              Users.findOneAndUpdate({_id: req.user._id}, {$set: {password: newHash}}, function (err, user) {
                if (user) {
                  return sendJSONResponse(res, HTTPStatus.OK, {
                    success: true,
                    message: "Updated User's Password Successfully !",
                    user: {
                      _id: user.id,
                      first_name: user.first_name,
                      last_name: user.last_name,
                      email: user.email,
                      avatar: user.avatar,
                      token: user.token,
                      role: user.role,
                    }
                  });
                }
                else {
                  return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
                    success: false,
                    message: err
                  })
                }
              })
            }
            else {
              return res.status(HTTPStatus.BAD_REQUEST).json({
                success: false,
                message: "Your old password is incorrect !"
              })
            }

          });
        }
        else {
          res.send("This user was not founded");
        }
      })
    }
  })
};

exports.default = {
  signup,
  login,
  getUserLoggedInfo,
  patch,
  changePassword
}