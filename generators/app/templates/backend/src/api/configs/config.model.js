import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ConfigSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    value: {
      type: String
    }
  },
  { timestamps: true }
);

ConfigSchema.plugin(mongoosePaginate);

export default mongoose.model('Config', ConfigSchema);