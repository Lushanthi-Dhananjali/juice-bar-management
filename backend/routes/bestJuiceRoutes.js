const express = require('express');
const router = express.Router();
const {
  getBestJuices,
  addBestJuice,
  updateBestJuice,
  deleteBestJuice,
} = require('../controllers/bestJuiceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/best-juices (Public)
// POST /api/best-juices (Admin Only)
router
  .route('/')
  .get(getBestJuices)
  .post(protect, adminOnly, addBestJuice);

// PUT /api/best-juices/:id (Admin Only)
// DELETE /api/best-juices/:id (Admin Only)
router
  .route('/:id')
  .put(protect, adminOnly, updateBestJuice)
  .delete(protect, adminOnly, deleteBestJuice);

module.exports = router;