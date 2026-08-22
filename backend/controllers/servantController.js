const Servant = require('../models/Servant');

// @desc    Get all servants list
// @route   GET /api/servants
// @access  Public (Customer and Admin)
const getServants = async (req, res) => {
  try {
    const servants = await Servant.find().sort({ createdAt: 1 });
    res.status(200).json(servants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new servant
// @route   POST /api/servants
// @access  Private / Admin only
const addServant = async (req, res) => {
  try {
    const { name, age } = req.body;

    if (!name || !age) {
      return res.status(400).json({ message: 'Please enter servant name and age' });
    }

    const servant = await Servant.create({
      name,
      age: Number(age),
    });

    res.status(201).json(servant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a servant
// @route   DELETE /api/servants/:id
// @access  Private / Admin only
const deleteServant = async (req, res) => {
  try {
    const servant = await Servant.findById(req.params.id);

    if (!servant) {
      return res.status(404).json({ message: 'Servant not found' });
    }

    await Servant.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Servant removed successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServants,
  addServant,
  deleteServant,
};