import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import Packages, { PACKAGE_TYPE, CREDIT_TYPE } from '../packages/packages.model'
import Users from '../users/users.model'

const PLATFORM_TYPE = {
  ANDROID: 'ANDROID',
  IOS: 'IOS'
};

export const PURCHASE_TYPE = {
  LIFETIME: 'LIFETIME',
  SUBSCRIPTION: 'SUBSCRIPTION',
  PREPAID: 'PREPAID'
};

const IAPSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product_id: {
      type: String,
      required: true
    },
    environment: {
      type: String
    },
    original_transaction_id: {
      type: String
    },
    transaction_id: {
      type: String
    },
    start_date: {
      type: Date
    },
    end_date: {
      type: Date
    },
    latest_receipt: {
      type: String
    },
    purchase_type: {
      type: String,
      enum: Object.values(PURCHASE_TYPE),
      default: PURCHASE_TYPE.PREPAID
    },
    platform: {
      type: String,
      enum: Object.values(PLATFORM_TYPE),
      default: PLATFORM_TYPE.IOS
    },
    retry_number: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

IAPSchema.pre('save', async function () {
  console.log('=======IAP pre save=========');
  if (this.isNew) {
    const packageObj = await Packages.findOne({
      product_id: this.product_id
    }).lean();
    if (packageObj) {
      if (packageObj.package_type === PACKAGE_TYPE.PREPAID) {
        await Users.findOneAndUpdate(
          { _id: this.user },
          { $inc: { credits: packageObj.credit } }
        );
      } else {
        // let listConfigs = await Configs.findOne({ name: 'bonus_credit' })
        // let bonus = listConfigs ? Number(listConfigs.value) : 0
        // console.log("BONUS ", bonus)
        await Users.findOneAndUpdate({ _id: this.user }, {
          isPremium: true,
        });
      }
    }
  }
});

IAPSchema.plugin(mongoosePaginate);

export default mongoose.model('IAP', IAPSchema);
