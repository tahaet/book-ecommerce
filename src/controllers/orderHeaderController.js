const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const handlerFactory = require('./handlerFactory');
const OrderHeader = require('../models/orderHeaderModel');
const catchAsync = require('../utils/catchAsync');
const OrderDetails = require('../models/orderDetailsModel');
const CartHeader = require('../models/cartHeaderModel');
const Roles = require('../utils/roles');
const sd = require('../utils/sd');

exports.setFilterToUserId = (req, res, next) => {
  if (req.user.role === Roles.USER || req.user.role === Roles.EMPLOYEE) {
    req.query.filter = req.user._id;
  }
  next();
};
exports.getAllOrders = handlerFactory.getAll(OrderHeader);
exports.createOrder = handlerFactory.createOne(OrderHeader);
exports.updateOrder = handlerFactory.updateOne(OrderHeader);
exports.deleteOrder = handlerFactory.deleteOne(OrderHeader);
exports.getOrder = handlerFactory.getOne(OrderHeader);
exports.createOrder = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const cart = await CartHeader.findOne({ user: req.user._id });

    let order = (
      await OrderHeader.create(
        [
          {
            ...cart.toObject(),
            orderTotal: cart.cartTotal,
            ...req.body,
            user: req.user._id,
          },
        ],
        {
          session,
        },
      )
    ).at(0);

    const orderItems = await OrderDetails.insertMany(
      cart.cartDetails.map((item) => ({
        ...item.toObject(),
        orderHeader: order._id,
      })),
      {
        session,
      },
    );

    order.orderDetails.push(...orderItems.map((x) => x._id));

    await order.save({ session });
    if (req.user.role === Roles.COMPANY) {
      order = await OrderHeader.findByIdAndUpdate(
        order._id,
        {
          paymentStatus: sd.PaymentStatusDelayedPayment,
          orderStatus: sd.StatusApproved,
        },
        session,
      );
      res.status(200).json({ message: 'success', data: order });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'success', data: order });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
});

exports.getStripeSession = catchAsync(async (req, res, next) => {
  const order = await OrderHeader.findById(req.params.orderId);
  const domain = `${req.protocol}://${req.get('host')}/`;
  const sessionOptions = {
    payment_method_types: ['card'],
    line_items: order.orderDetails.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.title,
          description: 'TEST',
          images: [`https://jsonplaceholder.com`],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.count,
    })),
    mode: 'payment',
    success_url: `${domain}api/v1/products/`,
    cancel_url: `${domain}api/v1/carts/my-cart`,
    // customer_email: req.user.email,
    // client_reference_id: order._id.toString(),
  };

  const stripeSession = await stripe.checkout.sessions.create(sessionOptions);

  if (req.user.role === Roles.COMPANY) {
    await OrderHeader.findOneAndUpdate(order._id, {
      paymentStatus: sd.PaymentStatusDelayedPayment,
      orderStatus: sd.StatusApproved,
    });
    await fetch(`${domain}api/v1/carts/my-cart`, { method: 'DELETE' });
  }

  order.sessionId = stripeSession.id;
  await order.save();
  res.status(200).json({
    status: 'success',
    data: stripeSession,
  });
});
exports.validateStripeSession = catchAsync(async (req, res, next) => {
  const order = await OrderHeader.findById(req.params.orderId);
  const session = await stripe.checkout.sessions.retrieve(order.sessionId);
  if (session.payment_status === 'paid') {
    order.paymentIntentId = session.payment_intent;
    order.paymentDate = new Date();
    order.orderStatus = sd.StatusApproved;
    order.paymentStatus = sd.PaymentStatusApproved;
    await order.save();
    res.status(200).json({
      message: 'success',
      session: session,
    });
  } else {
    res.status(404).json({
      message: "You didn't pay for this order, please pay for order first!",
      payment_link: session.url,
    });
  }
});
exports.startProcessing = catchAsync(async (req, res, next) => {
  const orderHeader = await OrderHeader.findByIdAndUpdate(req.body.orderId, {
    orderStatus: sd.StatusInProcess,
  });
  res.json({ status: 'success', data: orderHeader });
});
exports.shipOrder = catchAsync(async (req, res, next) => {
  const orderHeader = await OrderHeader.findByIdAndUpdate(req.body.orderId, {
    orderStatus: sd.StatusShipped,
    shippingDate: new Date(),
    trackingNumber: req.body.trackingNumber,
    carrier: req.body.carrier,
  });
  res.json({ status: 'success', data: orderHeader });
});
exports.cancelOrder = catchAsync(async (req, res, next) => {
  const orderHeader = await OrderHeader.findById(req.body.orderId);
  if (orderHeader.paymentStatus === sd.PaymentStatusApproved) {
    await stripe.refunds.create({
      payment_intent: orderHeader.paymentIntentId,
    });
  }
  await OrderHeader.findByIdAndUpdate(req.body.orderId, {
    orderStatus: sd.StatusCancelled,
    paymentStatus: sd.StatusRefunded,
  });
  res.json({ status: 'success', data: OrderHeader });
});

// exports.getMyOrder = catchAsync(async (req, res, next) => {
//   const Order = await OrderHeader.findOne({ user: req.user._id }).populate({
//     path: 'OrderDetails',
//     populate: { path: 'product', select: 'name price' },
//   });

//   if (!Order) {
//     return next(new Error('Order not found'));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: { Order },
//   });
// });
