"use strict";
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var constant = require('../../config/constant');
var mongoosePaginate = require('mongoose-paginate');

var emailValidate = [validate({validator: 'isEmail', message: 'invalid email!'})]

var UserSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: false
  },
  email: {
    type: String,
    validate: emailValidate,
    required: true
  },
  facebook: {
    id: {
      type: String,
      required: false
    },
    token: {
      type: String,
      required: false
    }
  },
  google: {
    id: {
      type: String,
      required: false
    },
    token: {
      type: String,
      required: false
    }
  },
  avatar: {
    type: String,
    required: false
  },
  address: String,
  location: { //[ <longitude> , <latitude> ]
    type: {type: String, required: false, default: "Point"},
    coordinates: {
      type: [Number],
      index: '2d'
    }
  },
  password: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'member'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

UserSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password')) {
    if (user.facebook.id || user.google.id) {
      next();
    }
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

UserSchema.methods.isAdmin = function () {
  return this.role === constant.ADMIN;
}

UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Users', UserSchema);

