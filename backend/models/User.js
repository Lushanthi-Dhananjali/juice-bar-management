const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Please enter your age'],
      min: [1, 'Age must be greater than 0'],
    },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

// Direct password comparison without bcrypt
userSchema.methods.matchPassword = async function (enteredPassword) {
  return enteredPassword === this.password;
};

module.exports = mongoose.model('User', userSchema);