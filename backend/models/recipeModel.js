const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['veg', 'non-veg'],
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  process: {
    type: String,
    required: true,
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: 'Image',
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  userInfo: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: 'hide',
  },
});

module.exports = mongoose.model('Recipe', RecipeSchema);
