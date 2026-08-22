const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST /api/orders (Logged-in users)
// GET /api/orders (Admin Only)
router
  .route('/')
  .post(protect, createOrder)
  .get(protect, adminOnly, getAllOrders);

// DELETE /api/orders/:id (Admin Only)
router
  .route('/:id')
  .delete(protect, adminOnly, deleteOrder);

module.exports = router;