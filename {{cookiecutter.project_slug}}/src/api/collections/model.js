import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const CollectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

CollectionSchema.plugin(mongoosePaginate);

export default mongoose.model('Category', CollectionSchema);
