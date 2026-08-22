const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuItemController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/menu (Public)
// POST /api/menu (Admin Only)
router
  .route('/')
  .get(getMenuItems)
  .post(protect, adminOnly, addMenuItem);

// PUT /api/menu/:id (Admin Only)
// DELETE /api/menu/:id (Admin Only)
router
  .route('/:id')
  .put(protect, adminOnly, updateMenuItem)
  .delete(protect, adminOnly, deleteMenuItem);

module.exports = router;