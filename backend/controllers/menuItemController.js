const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items (Up to 10+ items for the Menu page)
// @route   GET /api/menu
// @access  Public (Customer and Admin)
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: 1 });
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
      return res.status(400).json({ message: 'Please provide name, price, and number of items' });
    }

    const menuItem = await MenuItem.create({
      name,
      price: Number(price),
      numberOfItems: Number(numberOfItems),
    });

    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a menu item (name, price, or number of items)
// @route   PUT /api/menu/:id
// @access  Private / Admin only
const updateMenuItem = async (req, res) => {
  try {
    const { name, price, numberOfItems } = req.body;

    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    item.name = name || item.name;
    item.price = price !== undefined ? Number(price) : item.price;
    item.numberOfItems = numberOfItems !== undefined ? Number(numberOfItems) : item.numberOfItems;

    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private / Admin only
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Menu item deleted successfully', id: req.params.id });
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