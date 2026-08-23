const BestJuice = require('../models/BestJuice');
const MenuItem = require('../models/MenuItem');

// @desc    Get all Best Juices
// @route   GET /api/best-juices
// @access  Public
const getBestJuices = async (req, res) => {
  try {
    const juices = await BestJuice.find().sort({ createdAt: -1 });
    res.status(200).json(juices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new Best Juice with PC image & auto-sync to Menu
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

    const cleanName = name.trim();
    const itemPrice = Number(price);
    const imageUrl = `/uploads/${req.file.filename}`;

    // 1. Create in BestJuice (Home page)
    const newJuice = await BestJuice.create({
      name: cleanName,
      price: itemPrice,
      imageUrl,
    });

    // 2. Auto-sync to Menu
    let menuItem = await MenuItem.findOne({
      name: { $regex: new RegExp(`^${cleanName}$`, 'i') },
    });

    if (!menuItem) {
      await MenuItem.create({
        name: cleanName,
        price: itemPrice,
        numberOfItems: 20,
      });
    } else {
      menuItem.name = cleanName;
      menuItem.price = itemPrice;
      await menuItem.save();
    }

    res.status(201).json(newJuice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a Best Juice price/name AND sync to Menu Page
// @route   PUT /api/best-juices/:id
// @access  Private / Admin only
const updateBestJuicePrice = async (req, res) => {
  try {
    const { price, name } = req.body;
    const juice = await BestJuice.findById(req.params.id);

    if (!juice) {
      return res.status(404).json({ message: 'Juice item not found' });
    }

    const oldName = juice.name.trim();
    const newName = name ? name.trim() : juice.name;
    const newPrice = price !== undefined ? Number(price) : juice.price;

    juice.name = newName;
    juice.price = newPrice;
    const updatedJuice = await juice.save();

    // 2-WAY SYNC: Update matching item on Menu page
    const menuItem = await MenuItem.findOne({
      name: { $regex: new RegExp(`^${oldName}$`, 'i') },
    });

    if (menuItem) {
      menuItem.name = newName;
      menuItem.price = newPrice;
      await menuItem.save();
    }

    res.status(200).json(updatedJuice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a Best Juice AND delete from Menu if exists
// @route   DELETE /api/best-juices/:id
// @access  Private / Admin only
const deleteBestJuice = async (req, res) => {
  try {
    const juice = await BestJuice.findById(req.params.id);

    if (!juice) {
      return res.status(404).json({ message: 'Juice item not found' });
    }

    const juiceName = juice.name.trim();

    // 1. Delete from BestJuice
    await BestJuice.findByIdAndDelete(req.params.id);

    // 2. 2-WAY SYNC: Delete from Menu collection
    await MenuItem.deleteMany({
      name: { $regex: new RegExp(`^${juiceName}$`, 'i') },
    });

    res.status(200).json({
      message: 'Juice and matching menu item deleted successfully',
      id: req.params.id,
    });
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