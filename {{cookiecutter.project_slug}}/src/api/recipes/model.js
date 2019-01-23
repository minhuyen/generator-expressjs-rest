import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

// const mealTypes = ['breakfast', 'lunch', 'dinner', 'stack'];

const RecipeSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    kcal: {
      type: Number,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    net_carbs: {
      type: Number,
      required: true
    },
    protein: {
      type: Number,
      required: true
    },
    fat: {
      type: Number,
      required: true
    },
    meal_type: {
      type: Array,
      // enum: mealTypes,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  {
    timestamps: true
  }
);

RecipeSchema.plugin(mongoosePaginate);

export default mongoose.model('Recipe', RecipeSchema);
