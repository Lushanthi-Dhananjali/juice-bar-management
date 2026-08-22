const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getBestJuices,
  addBestJuice,
  updateBestJuicePrice,
  deleteBestJuice,
} = require('../controllers/bestJuiceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Routes
router
  .route('/')
  .get(getBestJuices)
  .post(protect, adminOnly, upload.single('image'), addBestJuice);

router
  .route('/:id')
  .put(protect, adminOnly, updateBestJuicePrice)
  .delete(protect, adminOnly, deleteBestJuice);

module.exports = router;