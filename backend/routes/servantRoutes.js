const express = require('express');
const router = express.Router();
const {
  getServants,
  addServant,
  deleteServant,
} = require('../controllers/servantController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/servants (Public)
// POST /api/servants (Admin Only)
router
  .route('/')
  .get(getServants)
  .post(protect, adminOnly, addServant);

// DELETE /api/servants/:id (Admin Only)
router
  .route('/:id')
  .delete(protect, adminOnly, deleteServant);

module.exports = router;