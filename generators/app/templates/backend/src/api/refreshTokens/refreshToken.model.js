import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const RefreshTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    token: {
      type: String,
      required: true
    },
    expires: {
      type: Date
    },
    createdByIp: {
      type: String
    },
    revoked: {
      type: Date
    },
    revokedByIp: {
      type: String
    },
    replacedByToken: {
      type: String
    }
  },
  { timestamps: true }
);

RefreshTokenSchema.virtual('isExpired').get(function() {
  return Date.now() >= this.expires;
});

RefreshTokenSchema.virtual('isActive').get(function() {
  return !this.revoked && !this.isExpired;
});

RefreshTokenSchema.plugin(mongoosePaginate);
RefreshTokenSchema.plugin(mongooseUniqueValidator);

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);
export default RefreshToken;
