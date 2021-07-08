import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongooseUniqueValidator from 'mongoose-unique-validator';

export const PACKAGE_TYPE = {
  LIFETIME: 'LIFETIME',
  SUBSCRIPTION: 'SUBSCRIPTION',
  PREPAID: 'PREPAID'
};

const UNIT_TYPE = {
  DAY: 'day',
  YEAR: 'month'
};

const PackagesSchema = new Schema(
  {
    name: {
      type: String,
      required: false
    },
    product_id: {
      type: String,
      unique: true,
      required: true
    },
    credit: {
      type: Number,
      default: 0,
    },
    package_type: {
      type: String,
      enum: Object.values(PACKAGE_TYPE),
      default: PACKAGE_TYPE.PREPAID
    },
    duration: {
      type: Number
    },
    unit: {
      type: String,
      enum: Object.values(UNIT_TYPE)
    },
  },
  {
    timestamps: true
  }
);

PackagesSchema.plugin(mongoosePaginate);
PackagesSchema.plugin(mongooseUniqueValidator);

const Packages = mongoose.model('Packages', PackagesSchema);
export default Packages;
