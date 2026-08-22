const User = require('../models/User');
const AdminPin = require('../models/AdminPin');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT Token
const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'fallback_juice_bar_secret_key_123';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (Customer or Admin)
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, age, role, password, adminPin } = req.body;

    // 1. Basic validation
    if (!name || !age || !role || !password) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    // 2. Validate role
    if (!['admin', 'customer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // 3. Admin Security PIN validation
    if (role === 'admin') {
      if (!adminPin) {
        return res.status(400).json({ message: 'Admin 4-digit PIN is required' });
      }

      // Fetch active system PIN or initialize default 9393
      let currentSystemPin = await AdminPin.findOne();
      if (!currentSystemPin) {
        currentSystemPin = await AdminPin.create({ pin: '9393' });
      }

      if (String(adminPin).trim() !== currentSystemPin.pin) {
        return res.status(401).json({ message: 'Invalid Admin Security PIN' });
      }
    }

    // 4. Check if user with same name already exists
    const userExists = await User.findOne({ name: name.trim() });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this name already exists' });
    }

    // 5. Create new user
    const user = await User.create({
      name: name.trim(),
      age: Number(age),
      role,
      password,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        age: user.age,
        role: user.role,
        token: generateToken(user._id, user.role),
        message: 'User registered successfully',
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { name, password, role } = req.body;

    // 1. Validate inputs
    if (!name || !password || !role) {
      return res.status(400).json({ message: 'Please provide name, password, and role' });
    }

    // 2. Find user matching BOTH name and role
    const user = await User.findOne({ name: name.trim(), role });

    // 3. Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        age: user.age,
        role: user.role,
        token: generateToken(user._id, user.role),
        message: 'Login successful',
      });
    } else {
      return res.status(401).json({ message: 'Invalid name, password, or role selection' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update Admin 4-digit security PIN (Admin Only)
// @route   PUT /api/auth/update-pin
// @access  Private / Admin
const updateAdminPin = async (req, res) => {
  try {
    const { currentPin, newPin } = req.body;

    // 1. Validate input
    if (!currentPin || !newPin) {
      return res.status(400).json({ message: 'Please provide both current and new 4-digit PIN' });
    }

    // 2. Validate new PIN format (must be exactly 4 numeric digits)
    const pinRegex = /^\d{4}$/;
    if (!pinRegex.test(String(newPin).trim())) {
      return res.status(400).json({ message: 'New PIN must be exactly 4 numeric digits' });
    }

    // 3. Retrieve active system PIN
    let systemPinDoc = await AdminPin.findOne();
    if (!systemPinDoc) {
      systemPinDoc = await AdminPin.create({ pin: '9393' });
    }

    // 4. Verify current PIN match
    if (systemPinDoc.pin !== String(currentPin).trim()) {
      return res.status(401).json({ message: 'Current Admin PIN is incorrect' });
    }

    // 5. Update PIN
    systemPinDoc.pin = String(newPin).trim();
    await systemPinDoc.save();

    return res.status(200).json({
      message: 'Admin security PIN updated successfully',
      newPin: systemPinDoc.pin,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateAdminPin,
  generateToken,
};