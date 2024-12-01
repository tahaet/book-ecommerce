const mongoose = require('mongoose');

const OrderHeaderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderDate: { type: Date, required: true, default: new Date() },
  shippingDate: { type: Date },
  orderTotal: { type: Number, required: true },
  orderStatus: { type: String },
  paymentStatus: { type: String },
  trackingNumber: { type: String },
  carrier: { type: String },
  paymentDate: { type: Date },
  paymentDueDate: {
    type: Date,
    required: true,
    default: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  },
  sessionId: { type: String },
  paymentIntentId: { type: String },
  phoneNumber: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  name: { type: String, required: true },
  orderDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderDetails',
    },
  ],
});

OrderHeaderSchema.pre(/^find/, function (next) {
  this.populate('orderDetails');
  next();
});

module.exports = mongoose.model('OrderHeader', OrderHeaderSchema);
