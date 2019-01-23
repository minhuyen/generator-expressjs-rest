import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'stack'];

const CalendarSchema = new Schema(
  {
    meal_date: {
      type: Date,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    meal_type: {
      type: String,
      enum: mealTypes,
      required: true
    },
    recipe: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true
    }
  },
  {
    timestamps: true
  }
);

CalendarSchema.plugin(mongoosePaginate);

export default mongoose.model('Calendar', CalendarSchema);
