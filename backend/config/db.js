const mongoose = require('mongoose');
const AdminPin = require('../models/AdminPin');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);

    // Check if an admin PIN exists, if not, create the default '9393'
    const existingPin = await AdminPin.findOne();
    if (!existingPin) {
      await AdminPin.create({ pin: process.env.DEFAULT_ADMIN_PIN || '9393' });
      console.log('Default Admin PIN initialized: 9393');
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;