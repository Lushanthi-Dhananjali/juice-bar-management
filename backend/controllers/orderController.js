const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @desc    Create a new order, calculate totals, and deduct inventory stock
// @route   POST /api/orders
// @access  Private (Logged-in Customer or Admin)
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    // 1. Validate that items exist
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    let calculatedTotal = 0;
    const processedItems = [];

    // 2. Verify stock availability and prepare items
    for (const item of items) {
      const { juiceName, quantity } = item;

      if (!juiceName || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid item format or quantity' });
      }

      // Find the menu item by name
      const menuItem = await MenuItem.findOne({ name: juiceName });

      if (!menuItem) {
        return res.status(404).json({ message: `Juice "${juiceName}" not found on menu` });
      }

      if (menuItem.numberOfItems < quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${juiceName}. Available: ${menuItem.numberOfItems}, requested: ${quantity}`,
        });
      }

      const subtotal = menuItem.price * Number(quantity);
      calculatedTotal += subtotal;

      processedItems.push({
        juiceName: menuItem.name,
        quantity: Number(quantity),
        price: menuItem.price,
        subtotal,
        menuItemDoc: menuItem, // keep reference to deduct later
      });
    }

    // 3. Deduct stock from MenuItem inventory
    for (const item of processedItems) {
      item.menuItemDoc.numberOfItems -= item.quantity;
      await item.menuItemDoc.save();
    }

    // 4. Save the completed order into database
    const order = await Order.create({
      customerName: req.user.name,
      items: processedItems.map(({ juiceName, quantity, price, subtotal }) => ({
        juiceName,
        quantity,
        price,
        subtotal,
      })),
      totalAmount: calculatedTotal,
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders history
// @route   GET /api/orders
// @access  Private / Admin only
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an order from database
// @route   DELETE /api/orders/:id
// @access  Private / Admin only
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Order deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  deleteOrder,
};