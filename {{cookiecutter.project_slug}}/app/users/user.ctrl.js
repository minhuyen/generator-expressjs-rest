"use strict";
let Users = require('../models/users'),
    HTTPStatus = require('../helpers/lib/http_status'),
    config = require('../config/database'), // get db config file
    utils = require('../helpers/lib/utils'),
    constant = require('../helpers/lib/constant');

let bcrypt = require('bcrypt');
let randomstring = require("randomstring");
let nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false, // upgrade later with STARTTLS
//     auth: {
//         user: 'darkwind3107@gmail.com',
//         pass: 'hieu824477'
//     }
// });

let sparkPostTransport = require('nodemailer-sparkpost-transport');
let sendEmail = function (res, text, email, subject, html) {
    var transporter = nodemailer.createTransport(sparkPostTransport({
        // sparkPostApiKey: 'b83d41344bfa22d6a089a93c19bd8364b7c3ce42'
        sparkPostApiKey: '2ea9ced6a53c73c7a22cae5290c5eb90fd592ac7'
    }));

    var mailOptions = {
        from: 'support@tiembanhmh.com', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, //, // plaintext body,
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            // console.log(error);
            sendJSONResponse(res, HTTPStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: error
            })
        } else {
            // console.log('Message sent: ' + info.response);
            // res.json({yo: info.response});
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: true,
                message: 'Verify Code Has Been Sent'
            })
        }
    });
};

let sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
// var checkParticipant = (participant) => { return Invitation.findOne({ participant: participant }).exec() }
//
// var checkReferAndUpdateBlance = function(referCode, participant) {
//   return new Promise(function(resolve, reject) {
//     var referer = "";
//     var balance = 0;
//     console.log("participant", participant);
//     // var patricipant1 = participant;
//     checkParticipant(participant).then(result => {
//       if (result) {
//         return reject("you only be able to get the reward one time!");
//       }
//       else {
//         Users.findOne({ referCode: referCode }, function(err, user) {
//           if (err) {
//             return reject(err);
//           }
//           if (!user) {
//             // var newInvitation = new Invitation({ referer: null, patricipant: patricipant, balance: 0, status: "false", errorMessage: "not found referer with this referCode ", referCode: referCode });
//             // newInvitation.save();
//             // console.log("not found any user with this refer");
//             return resolve(false);
//           }
//           else {
//             var newInvitation = new Invitation({ referer: user._id, participant: participant, balance: 1, status: "success", referCode: referCode });
//             newInvitation.save(function(err, success) {
//               if (err) {
//                 return reject(err);
//               }
//               else {
//                 Users.findOneAndUpdate({ _id: success.referer }, { balance: user.balance + 1 }, { new: true }, function(err, newBalance) {
//                   if (err) {
//                     return reject(err);
//                   }
//                   else {
//                     Users.findOneAndUpdate({ _id: success.participant }, { balance: 1 }, { new: true }, function(err, newBalance1) {
//                       if (err) {
//                         return reject(err);
//                       }
//                       else {
//                         return resolve(true);
//                       }
//                     })
//
//
//                   }
//                 })
//               }
//             })
//           }
//
//         })
//       }
//     }).catch(err => {
//       return reject(err);
//     })
//
//   })
// }
//
// var checkSame = (code) => { return Users.count({ referCode: code }).exec() };
// var generateReferCode = function() {
//   return new Promise(function(resolve, reject) {
//     var referCode = "";
//     do {
//       referCode = randomstring.generate({
//         length: 6,
//         charset: 'hex',
//         capitalization: 'lowercase'
//       });
//     }
//     while (checkSame(referCode) > 0)
//     console.log("referCode", referCode);
//     return resolve(referCode);
//
//   })
// }

exports.signup = function (req, res) {
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

exports.login = function (req, res) {
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
                        _id: user._id
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

exports.loginSocial = function (req, res) {
    if (req.body.role === constant.ADMIN) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
            success: false,
            message: "You do not have a permission to set admin role"
        });
    }

    if (req.body.role !== constant.CONSUMER && req.body.role !== constant.PROVIDER)
        return sendJSONResponse(res, HTTPStatus.BAD_REQUEST, {
            success: false,
            message: 'Invalid Role!'
        })

    var user = req.user;
    user.role = req.body.role;

    var token = utils.generateToken(user, config.secret);
    user.token = 'Bearer ' + token;

    Users.findOne({'email': user.email, role: user.role}, function (err, results) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
            return sendJSONResponse(res, HTTPStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: err
            });

        // if the user is found, then log them in
        if (results) {
            // user.save()
            return sendJSONResponse(res, HTTPStatus.OK, {
                success: true,
                token: results.token,
                role: results.role,
                _id: results._id,
                hasPhoneNumber: !!results.phone_number
            }) // user found, return that user
        } else {
            // if there is no user found with that facebook id, create them
            var newUser = new Users(user);

            // save our user to the database
            newUser.save(function (err, docs) {
                if (err) {
                    return sendJSONResponse(res, HTTPStatus.INTERNAL_SERVER_ERROR, {
                        success: false,
                        message: err
                    })
                }
                // if successful, return the new user
                return sendJSONResponse(res, HTTPStatus.CREATED, {
                    success: true,
                    token: 'Bearer ' + token,
                    role: user.role,
                    _id: user._id,
                    hasPhoneNumber: !!user.phone_number
                })
            });
        }

    });
};

exports.userGET = (req, res) => {
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

exports.userPATCH = (req, res) => {
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
        if(req.body.password)
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

exports.changePassword = function (req, res) {
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

exports.sendVerifyCode = function (req, res) {
    req.checkBody('email', 'Email should not be empty !').notEmpty();
    req.checkBody('email', 'Invalid email type !').isEmail();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            var error = result.useFirstErrorOnly().array()[0].msg;
            return res.status(HTTPStatus.BAD_REQUEST).send({
                success: false,
                message: error
            });
        }
        else {
            Users.findOne({email: req.body.email, role: req.body.role}, function (err, user) {
                if (err) {
                    return res.status(HTTPStatus.BAD_REQUEST).json({success: false, message: err});
                }
                else {
                    if (user) {
                        var input_value = "";
                        if (user.first_name) {
                            input_value = user.first_name;
                        }
                        else {
                            input_value = user.email;
                        }
                        var verify_code = randomstring.generate({
                            length: 4,
                            charset: 'hex',
                            capitalization: 'uppercase'
                        });
                        user.verify_token = verify_code;
                        user.save();

                        let mailOptions = {
                            from: "Gxx Admin", // sender address
                            to: user.email, // list of receivers
                            subject: 'GXX - Email verification code', // Subject line
                            text: 'GXX - Email verification code', // plain text body
                            html: '<div> <p>Hi ' + input_value + '!</p> </br> <p> You recently requested to reset your password for your GXX account.</p> </br> <p> Please use the following verification code <b>' + verify_code + '</b> to reset the password in the GXX app.</p> </br> <p> If you did not request a password reset, please ignore this email or simply reply to let us know. </p> </br> <p> Thanks!</p> </br> <p>Your friends at GXX </p> </div>'
                        };

                        let _text = 'GXX - Email verification code'
                        // let _html = data
                        let _subject = 'GXX - Email verification code';
                        let _email = user.email;
                        let _html = '<div> <p>Hi ' + input_value + '!</p> </br> <p> You recently requested to reset your password for your GXX account.</p> </br> <p> Please use the following verification code <b>' + verify_code + '</b> to reset the password in the GXX app.</p> </br> <p> If you did not request a password reset, please ignore this email or simply reply to let us know. </p> </br> <p> Thanks!</p> </br> <p>Your friends at GXX </p> </div>'


                        sendEmail(res, _text, _email, _subject, _html)
                        // sendJSONResponse(res, HTTPStatus.OK, {
                        //     success: true,
                        //     message: 'Verify Code Has Been Sent!'
                        // })
                        // transporter.sendMail(mailOptions, (error, info) => {
                        //     if (error) {
                        //         return res.send(error);
                        //     }
                        //     else {
                        //         res.send(info);
                        //     }
                        //     console.log('Message %s sent: %s', info.messageId, info.response);
                        // });
                    }
                    else {
                        res.status(HTTPStatus.BAD_REQUEST).json({
                            success: false,
                            message: "Not found this email in our system !"
                        })
                    }
                }

            })
        }
    })
};

exports.checkVerifyCode = function (req, res) {
    req.checkBody('verify_token', 'Verify code should not be empty').notEmpty();

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            var error = result.useFirstErrorOnly().array()[0].msg;
            return res.status(HTTPStatus.BAD_REQUEST).send({
                success: false,
                message: error
            });
        }
        else {
            Users.findOne({verify_token: req.body.verify_token}, function (err, user) {
                if (user) {
                    return res.status(HTTPStatus.OK).json({
                        success: true,
                        message: "Verify code is match",
                        email: user.email
                    });
                }
                else {
                    return res.status(HTTPStatus.BAD_REQUEST).json({
                        success: false,
                        message: "Your verify code is wrong"
                    });
                }
            })

        }
    })
};

exports.createNewPassword = function (req, res) {
    req.checkBody('email', 'email should not be empty !').notEmpty();
    req.checkBody('email', 'invalid email type !').isEmail();
    req.checkBody('verify_token', 'verify code should not be empty').notEmpty();
    req.checkBody('password', 'new password should not be empty').notEmpty();
    req.checkBody('password', 'new password should has 6 character as least !').isLength({min: 6, max: 100});

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            var error = result.useFirstErrorOnly().array()[0].msg;
            return res.status(HTTPStatus.BAD_REQUEST).send({
                success: false,
                message: error
            });
        }
        else {
            Users.findOne({email: req.body.email, verify_token: req.body.verify_token}, function (err, user) {
                if (user) {
                    var newHash = bcrypt.hashSync(req.body.password, 10);

                    Users.findOneAndUpdate({_id: user._id}, {
                        $set: {
                            password: newHash,
                            verify_code: ""
                        }
                    }, function (err, user) {
                        if (user) {
                            res.status(HTTPStatus.OK);
                            res.json({
                                success: true,
                                message: "Updated user's password successfully !",
                                user: {
                                    _id: user.id,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    email: user.email,
                                    avatar: user.avatar,
                                    token: user.token,
                                    role: user.role
                                }
                            });
                        }
                        else {
                            return res.status(HTTPStatus.BAD_REQUEST).json({
                                success: false,
                                message: err
                            });
                        }
                    })
                }
                else {
                    return res.status(HTTPStatus.BAD_REQUEST).json({
                        success: false,
                        message: "your email or verify code is wrong"
                    });
                }
            })
        }
    })
}