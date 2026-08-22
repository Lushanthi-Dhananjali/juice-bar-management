const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Automatically hash password before saving to MongoDB
// Note: Do NOT use 'next' parameter when using async/await in Mongoose pre-save hooks
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check if entered password matches the stored hashed password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);