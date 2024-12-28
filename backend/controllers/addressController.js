const Address = require('../models/Address');

// Get all addresses for the logged-in user
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }); // Filter by logged-in user's ID
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error });
  }
};

// Add a new address for the logged-in user
const addAddress = async (req, res) => {
  try {
    const newAddress = await Address.create({ ...req.body, user: req.user.id }); // Associate with user's ID
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error });
  }
};

// Update an address if it belongs to the logged-in user
const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user.id }); // Find by ID and user
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    Object.assign(address, req.body); // Update address fields
    await address.save();
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error });
  }
};

// Delete an address if it belongs to the logged-in user
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user.id }); // Find by ID and user
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error });
  }
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
