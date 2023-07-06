import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseUniqueValidator from "mongoose-unique-validator";

const PLATFORM = {
  IOS: "iOS",
  ANDROID: "android"
};

const DeviceTokenSchema = new Schema(
  {
    name: {
      type: String,
      required: false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    deviceId: {
      type: String,
      required: false
    },
    platform: {
      type: String,
      enum: Object.values(PLATFORM),
      default: PLATFORM.IOS,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

DeviceTokenSchema.plugin(mongoosePaginate);
DeviceTokenSchema.plugin(mongooseUniqueValidator);

const DeviceToken = mongoose.model("DeviceToken", DeviceTokenSchema);
export default DeviceToken;
