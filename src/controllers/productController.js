const handlerFactory = require('./handlerFactory');
const Product = require('../models/productModel');

exports.getOneProduct = handlerFactory.getOne(Product);
exports.getAllProducts = handlerFactory.getAll(Product);
exports.createProduct = handlerFactory.createOne(Product);
exports.deleteProduct = handlerFactory.deleteOne(Product);
exports.updateProduct = handlerFactory.deleteOne(Product);
