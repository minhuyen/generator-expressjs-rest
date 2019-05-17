import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import bcrypt from 'bcryptjs';

const roles = ['user', 'admin'];

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: false,
      minlength: 6
    },
    role: {
      type: String,
      enum: roles,
      default: 'user'
    },
    services: {
      facebook: {
        id: String,
        token: String
      },
      google: {
        id: String,
        token: String
      }
    },
    avatar: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

UserSchema.pre('save', function(next) {
  const user = this;
  if (this.isModified('password')) {
    if (
      (user.facebook && user.facebook.id) ||
      (user.google && user.google.id)
    ) {
      next();
    }
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
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

UserSchema.methods.verifyPassword = function(passw) {
  return bcrypt.compareSync(passw, this.password);
};

UserSchema.plugin(mongoosePaginate);

export default mongoose.model('User', UserSchema);
