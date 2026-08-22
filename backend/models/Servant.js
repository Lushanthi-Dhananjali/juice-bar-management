const mongoose = require('mongoose');

const servantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter servant name'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Please enter servant age'],
      min: [18, 'Servant must be at least 18 years old'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Servant', servantSchema);