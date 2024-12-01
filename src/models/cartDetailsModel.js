const mongoose = require('mongoose');

const CartDetailsSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  cartHeader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CartHeader',
    required: true,
  },
  count: { type: Number, required: true },
  price: { type: Number, required: true },
});

CartDetailsSchema.pre(/^find/, function (next) {
  this.populate('product');
  next();
});

module.exports = mongoose.model('CartDetails', CartDetailsSchema);
