import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import Packages, { PACKAGE_TYPE } from "../packages/packages.model";
import Users from "../users/users.model";

export const PLATFORM_TYPE = {
  ANDROID: "ANDROID",
  IOS: "IOS"
};

export const PURCHASE_TYPE = {
  LIFETIME: "LIFETIME",
  SUBSCRIPTION: "SUBSCRIPTION",
  PREPAID: "PREPAID"
};

export const STATUS_TYPE = {
  NEW: "new",
  USED: "used"
};

const IAPSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    deviceId: {
      type: String,
      required: false
    },
    productId: {
      type: String,
      required: true
    },
    bundleId: {
      type: String
    },
    subscriptionGroupIdentifier: {
      type: String,
      required: true
    },
    environment: {
      type: String
    },
    originalTransactionId: {
      type: String
    },
    webOrderLineItemId: {
      type: String
    },
    transactionIds: {
      type: [String]
    },
    purchaseDate: {
      type: Date
    },
    originalPurchaseDate: {
      type: Date
    },
    expiresDate: {
      type: Date
    },
    quantity: {
      type: Number
    },
    type: {
      type: String
    },
    inAppOwnershipType: {
      type: String
    },
    signedDate: {
      type: Date
    },
    transactionReason: {
      type: String
    },
    storefront: {
      type: String
    },
    storefrontId: {
      type: String
    },
    price: {
      type: Number
    },
    currency: {
      type: String
    },
    latestReceipt: {
      type: String
    },
    purchaseType: {
      type: String,
      enum: Object.values(PURCHASE_TYPE),
      default: PURCHASE_TYPE.PREPAID
    },
    platform: {
      type: String,
      enum: Object.values(PLATFORM_TYPE),
      default: PLATFORM_TYPE.IOS
    },
    retryNumber: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: Object.values(STATUS_TYPE),
      default: STATUS_TYPE.NEW
    },
    reason: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

IAPSchema.plugin(mongoosePaginate);

export default mongoose.model("IAP", IAPSchema);
