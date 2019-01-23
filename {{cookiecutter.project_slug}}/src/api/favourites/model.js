import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const FavouriteSchema = new Schema(
  {
    recipe: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

FavouriteSchema.plugin(mongoosePaginate);

export default mongoose.model('Favourite', FavouriteSchema);
