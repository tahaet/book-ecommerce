const mongoose = require('mongoose');

const CartHeaderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cartDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CartDetails',
      // required: true,
    },
  ],
  cartTotal: {
    type: Number,
  },
});
CartHeaderSchema.pre(/^find/, function (next) {
  this.populate('cartDetails');
  next();
});
CartHeaderSchema.virtual('TotalPrice').get(function () {
  return this.cartDetails.reduce(
    (total, cartDetail) => total + cartDetail.price * cartDetail.count,
    0,
  );
});

module.exports = mongoose.model('CartHeader', CartHeaderSchema);
