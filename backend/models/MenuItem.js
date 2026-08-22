const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter juice name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please enter juice price'],
      min: [0, 'Price cannot be negative'],
    },
    numberOfItems: {
      type: Number,
      required: [true, 'Please enter available number of items'],
      min: [0, 'Available items cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);