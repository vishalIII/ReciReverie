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
    type: String,
    default:"https://th.bing.com/th/id/OIP.TdfS0KCXffAUAt1020UAIAAAAA?w=165&h=169&c=7&r=0&o=5&pid=1.7"
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
