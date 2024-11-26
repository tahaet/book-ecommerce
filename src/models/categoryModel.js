const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category Name is required'],
    maxLength: [30, 'Category Name cannot exceed 30 characters'],
  },
  displayOrder: {
    type: Number,
    required: [true, 'Display Order is required'],
    min: [1, 'Display Order must be at least 1'],
    max: [100, 'Display Order cannot exceed 100'],
  },
  description: String,
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
