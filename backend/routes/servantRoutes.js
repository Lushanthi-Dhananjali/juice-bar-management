const express = require('express');
const router = express.Router();
const {
  getServants,
  addServant,
  updateServant,
  deleteServant,
} = require('../controllers/servantController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/servants (Public)
// POST /api/servants (Admin Only)
router
  .route('/')
  .get(getServants)
  .post(protect, adminOnly, addServant);

// PUT /api/servants/:id (Admin Only - Edit Name/Age)
// DELETE /api/servants/:id (Admin Only - Delete Servant)
router
  .route('/:id')
  .put(protect, adminOnly, updateServant)
  .delete(protect, adminOnly, deleteServant);

module.exports = router;