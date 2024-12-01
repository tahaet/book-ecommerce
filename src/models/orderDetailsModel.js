const mongoose = require('mongoose');

const OrderDetailSchema = new mongoose.Schema({
  orderHeader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderHeader',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  count: { type: Number, required: true },
  price: { type: Number, required: true },
});

OrderDetailSchema.pre(/^find/, function (next) {
  this.populate('product');
  next();
});

module.exports = mongoose.model('OrderDetails', OrderDetailSchema);
