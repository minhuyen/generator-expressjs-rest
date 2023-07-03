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
      required: true
    },
    deviceId: {
      type: String,
      required: false
    },
    productId: {
      type: String,
      required: true
    },
    environment: {
      type: String
    },
    originalTransactionId: {
      type: String
    },
    transactionId: {
      type: String
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
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
    }
  },
  {
    timestamps: true
  }
);

IAPSchema.pre("save", async function() {
  console.log("=======IAP pre save=========");
  if (this.isNew) {
    const packageObj = await Packages.findOne({
      productId: this.productId
    }).lean();
    if (packageObj) {
      if (packageObj.packageType === PACKAGE_TYPE.PREPAID) {
        await Users.findOneAndUpdate(
          { _id: this.user },
          { $inc: { credits: packageObj.credit } }
        );
      } else {
        // let listConfigs = await Configs.findOne({ name: 'bonus_credit' })
        // let bonus = listConfigs ? Number(listConfigs.value) : 0
        // console.log("BONUS ", bonus)
        await Users.findOneAndUpdate(
          { _id: this.user },
          {
            isPremium: true
          }
        );
      }
    }
  }
});

IAPSchema.plugin(mongoosePaginate);

export default mongoose.model("IAP", IAPSchema);
