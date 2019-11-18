import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcryptjs';

const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

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
      enum: Object.values(ROLES),
      default: ROLES.USER
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

UserSchema.pre('save', async function() {
  const password = this.password;
  if (this.isModified('password')) {
    const saltRounds = 101;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    this.password = passwordHash;
  }
});

UserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(mongooseUniqueValidator);

UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.password_reset_token;
  delete obj.password_reset_expires;
  return obj;
};

export default mongoose.model('User', UserSchema);
