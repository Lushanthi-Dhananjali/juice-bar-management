const Servant = require('../models/Servant');

// @desc    Get all servants
// @route   GET /api/servants
// @access  Public (or Protected)
const getServants = async (req, res) => {
  try {
    const servants = await Servant.find().sort({ createdAt: -1 });
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
      return res.status(400).json({ message: 'Please provide servant name and age' });
    }

    const newServant = await Servant.create({
      name: name.trim(),
      age: Number(age),
    });

    res.status(201).json(newServant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a servant's Name and Age
// @route   PUT /api/servants/:id
// @access  Private / Admin only
const updateServant = async (req, res) => {
  try {
    const { name, age } = req.body;
    const servant = await Servant.findById(req.params.id);

    if (!servant) {
      return res.status(404).json({ message: 'Servant not found' });
    }

    if (name) servant.name = name.trim();
    if (age !== undefined) servant.age = Number(age);

    const updatedServant = await servant.save();
    res.status(200).json(updatedServant);
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
  updateServant,
  deleteServant,
};