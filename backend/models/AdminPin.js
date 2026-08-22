const mongoose = require('mongoose');

const adminPinSchema = new mongoose.Schema(
  {
    pin: {
      type: String,
      required: true,
      default: '9393',
      minlength: 4,
      maxlength: 4,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AdminPin', adminPinSchema);