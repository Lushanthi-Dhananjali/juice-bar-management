const BestJuice = require('../models/BestJuice');

// @desc    Get all Best Juices added by Admin
// @route   GET /api/best-juices
// @access  Public (Customer and Admin)
const getBestJuices = async (req, res) => {
  try {
    const juices = await BestJuice.find().sort({ createdAt: -1 });
    res.status(200).json(juices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new Best Juice with PC image upload (Admin only)
// @route   POST /api/best-juices
// @access  Private / Admin only
const addBestJuice = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Please provide juice name and price' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image from your PC' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const newJuice = await BestJuice.create({
      name: name.trim(),
      price: Number(price),
      imageUrl,
    });

    res.status(201).json(newJuice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a Best Juice price (Admin only)
// @route   PUT /api/best-juices/:id
// @access  Private / Admin only
const updateBestJuicePrice = async (req, res) => {
  try {
    const { price, name } = req.body;
    const juice = await BestJuice.findById(req.params.id);

    if (!juice) {
      return res.status(404).json({ message: 'Juice item not found' });
    }

    if (price !== undefined) juice.price = Number(price);
    if (name) juice.name = name.trim();

    const updatedJuice = await juice.save();
    res.status(200).json(updatedJuice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a Best Juice (Admin only)
// @route   DELETE /api/best-juices/:id
// @access  Private / Admin only
const deleteBestJuice = async (req, res) => {
  try {
    const juice = await BestJuice.findById(req.params.id);

    if (!juice) {
      return res.status(404).json({ message: 'Juice item not found' });
    }

    await BestJuice.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Juice removed successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBestJuices,
  addBestJuice,
  updateBestJuicePrice,
  deleteBestJuice,
};