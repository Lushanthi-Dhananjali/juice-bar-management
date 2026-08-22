const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateAdminPin,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public Routes (Customer & Admin registration/login)
router.post('/signup', registerUser);
router.post('/login', loginUser);

// Protected Admin-Only Route (Change security PIN)
router.put('/update-pin', protect, adminOnly, updateAdminPin);

module.exports = router;