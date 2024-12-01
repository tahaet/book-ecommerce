const mongoose = require('mongoose');
const handlerFactory = require('./handlerFactory');
const CartHeader = require('../models/cartHeaderModel');
const catchAsync = require('../utils/catchAsync');
const CartDetails = require('../models/cartDetailsModel');
const AppError = require('../appError');
const Product = require('../models/productModel');

exports.getAllCarts = handlerFactory.getAll(CartHeader);
exports.createCart = handlerFactory.createOne(CartHeader);
exports.updateCart = handlerFactory.updateOne(CartHeader);
exports.deleteCart = handlerFactory.deleteOne(CartHeader);

exports.addToMyCart = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let cart = await CartHeader.findOne({ user: req.user._id }).session(
      session,
    );
    if (!cart) {
      cart = (
        await CartHeader.create([{ user: req.user._id }], { session })
      ).at(0);
    }

    const product = await Product.findById(req.body.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const existingItem = await CartDetails.findOne({
      product: req.body.productId,
      cartHeader: cart._id,
    }).session(session);

    if (existingItem) {
      existingItem.count += req.body.count || 1;
      existingItem.price = product.price;
      await existingItem.save({ session });
    } else {
      const cartItem = (
        await CartDetails.create(
          [
            {
              product: req.body.productId,
              user: req.user._id,
              count: req.body.count || 1,
              price: product.price,
              cartHeader: cart._id,
            },
          ],
          { session },
        )
      ).at(0);
      cart.cartDetails.push(cartItem._id);
    }

    cart.cartTotal = await CartDetails.find({ cartHeader: cart._id })
      .session(session)
      .then((items) =>
        items.reduce((total, item) => total + item.price * item.count, 0),
      );

    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 'success',
      data: { cart },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
});
exports.removeFromMyCart = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    let cart = await CartHeader.findOne({ user: req.user._id }).session(
      session,
    );
    if (!cart)
      return next(
        new AppError('Your cart is empty please add some items', 404),
      );

    const cartItem = await CartDetails.findOneAndDelete({
      cartHeader: cart._id,
      product: req.body.productId,
    }).session(session);
    if (!cartItem) {
      return next(new AppError('Cart item not found', 404));
    }

    cart = await CartHeader.findOneAndUpdate(
      { _id: cart._id },
      {
        $pull: { cartDetails: cartItem._id },
      },
      { session },
    );
    if (cart && cart.cartDetails.length === 0) {
      await cart.deleteOne().session(session);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
});

exports.getMyCart = catchAsync(async (req, res, next) => {
  const cart = await CartHeader.findOne({ user: req.user._id }).populate({
    path: 'cartDetails',
    populate: { path: 'product', select: 'name price' },
  });

  if (!cart) {
    return next(new Error('Cart not found'));
  }

  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

exports.getCart = handlerFactory.getOne(CartHeader);

exports.clearMyCart = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const cart = await CartHeader.findOne({ user: req.user._id });
    await CartDetails.deleteMany({ cartHeader: cart._id }, session);

    await CartHeader.deleteOne({ _id: cart._id }, session);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }
});
