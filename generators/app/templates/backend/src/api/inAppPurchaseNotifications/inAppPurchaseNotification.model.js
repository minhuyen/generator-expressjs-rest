import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseUniqueValidator from "mongoose-unique-validator";

const InAppPurchaseNotificationSchema = new Schema(
  {
    notificationType: {
      type: String,
      required: false
    },
    subtype: {
      type: String,
      required: false
    },
    data: {
      type: Object,
      required: false
    },
    summary: {
      type: Object,
      required: false
    },
    externalPurchaseToken: {
      type: Object,
      required: false
    },
    version: {
      type: String,
      required: false
    },
    signedDate: {
      type: Date,
      required: false
    },
    notificationUUID: {
      type: String,
      required: false
    },
    platform: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

InAppPurchaseNotificationSchema.plugin(mongoosePaginate);
InAppPurchaseNotificationSchema.plugin(mongooseUniqueValidator);

const InAppPurchaseNotification = mongoose.model(
  "InAppPurchaseNotification",
  InAppPurchaseNotificationSchema
);
export default InAppPurchaseNotification;
