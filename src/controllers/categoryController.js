const handlerFactory = require('./handlerFactory');
const Category = require('../models/categoryModel');

exports.getOneCategory = handlerFactory.getOne(Category);
exports.getAllCategories = handlerFactory.getAll(Category);
exports.createCategory = handlerFactory.createOne(Category);
exports.deleteCategory = handlerFactory.deleteOne(Category);
exports.updateCategory = handlerFactory.deleteOne(Category);
