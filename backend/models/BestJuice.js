const mongoose = require('mongoose');

const bestJuiceSchema = new mongoose.Schema(
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
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BestJuice', bestJuiceSchema);