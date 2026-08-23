const MenuItem = require('../models/MenuItem');
const BestJuice = require('../models/BestJuice');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new menu item
// @route   POST /api/menu
// @access  Private / Admin only
const addMenuItem = async (req, res) => {
  try {
    const { name, price, numberOfItems } = req.body;

    if (!name || price === undefined || numberOfItems === undefined) {
      return res.status(400).json({ message: 'Please provide name, price, and stock count' });
    }

    const cleanName = name.trim();
    const existing = await MenuItem.findOne({
      name: { $regex: new RegExp(`^${cleanName}$`, 'i') },
    });

    if (existing) {
      return res.status(400).json({ message: 'A menu item with this name already exists' });
    }

    const newItem = await MenuItem.create({
      name: cleanName,
      price: Number(price),
      numberOfItems: Number(numberOfItems),
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a menu item & sync with Home Page item
// @route   PUT /api/menu/:id
// @access  Private / Admin only
const updateMenuItem = async (req, res) => {
  try {
    const { name, price, numberOfItems } = req.body;
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const oldName = menuItem.name.trim();
    const newName = name ? name.trim() : menuItem.name;
    const newPrice = price !== undefined ? Number(price) : menuItem.price;
    const newStock = numberOfItems !== undefined ? Number(numberOfItems) : menuItem.numberOfItems;

    // Update Menu collection
    menuItem.name = newName;
    menuItem.price = newPrice;
    menuItem.numberOfItems = newStock;
    const updatedMenuItem = await menuItem.save();

    // 2-WAY SYNC: Update matching Home Juice
    const homeJuice = await BestJuice.findOne({
      name: { $regex: new RegExp(`^${oldName}$`, 'i') },
    });

    if (homeJuice) {
      homeJuice.name = newName;
      homeJuice.price = newPrice;
      await homeJuice.save();
    }

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a menu item AND delete from Home Page if exists
// @route   DELETE /api/menu/:id
// @access  Private / Admin only
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const itemName = menuItem.name.trim();

    // Delete from MenuItem collection
    await MenuItem.findByIdAndDelete(req.params.id);

    // 2-WAY SYNC: Also delete from BestJuice (Home Page)
    await BestJuice.deleteMany({
      name: { $regex: new RegExp(`^${itemName}$`, 'i') },
    });

    res.status(200).json({ message: 'Menu item and matching Home Juice deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};