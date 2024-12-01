const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  ISBN: {
    type: String,
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
  },

  price: {
    type: Number,
    required: [true, 'Price for 1-50 is required'],
    min: [1, 'Price must be at least 1'],
    max: [1000, 'Price cannot exceed 1000'],
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  productImages: {
    type: [String],
    default: ['/public/img/products/default.jpg'],
  },
});
// in arrow syntax this doesn't point to current document
productSchema.pre(/^find/, function (next) {
  this.populate({ path: 'category', select: 'name displayOrder' });
  next();
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
