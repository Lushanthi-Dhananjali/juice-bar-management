const BestJuice = require('../models/BestJuice');

// @desc    Get all best juices (Max 5 for Home page)
// @route   GET /api/best-juices
// @access  Public (Customer and Admin)
const getBestJuices = async (req, res) => {
  try {
    const juices = await BestJuice.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(juices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new best juice
// @route   POST /api/best-juices
// @access  Private / Admin only
const addBestJuice = async (req, res) => {
  try {
    const { name, price, imageUrl } = req.body;

    if (!name || !price || !imageUrl) {
      return res.status(400).json({ message: 'Please provide juice name, price, and image URL' });
    }

    const juice = await BestJuice.create({
      name,
      price: Number(price),
      imageUrl,
    });

    res.status(201).json(juice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a best juice price or details
// @route   PUT /api/best-juices/:id
// @access  Private / Admin only
const updateBestJuice = async (req, res) => {
  try {
    const { name, price, imageUrl } = req.body;

    const juice = await BestJuice.findById(req.params.id);

    if (!juice) {
      return res.status(404).json({ message: 'Juice item not found' });
    }

    juice.name = name || juice.name;
    juice.price = price !== undefined ? Number(price) : juice.price;
    juice.imageUrl = imageUrl || juice.imageUrl;

    const updatedJuice = await juice.save();
    res.status(200).json(updatedJuice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a best juice
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
  updateBestJuice,
  deleteBestJuice,
};