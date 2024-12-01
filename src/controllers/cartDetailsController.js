const handlerFactory = require('./handlerFactory');
const CartDetails = require('../models/cartDetailsModel');

exports.getOneCartItem = handlerFactory.getOne(CartDetails);
exports.createCartItem = handlerFactory.createOne(CartDetails);
exports.deleteCartItem = handlerFactory.deleteOne(CartDetails);
exports.updateCartItem = handlerFactory.deleteOne(CartDetails);
