const express = require('express');
const Address = require('../models/Address');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all addresses for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve addresses: ' + error.message });
  }
});

// Add a new address
router.post('/', authenticate, async (req, res) => {
  const { name, line1, city, state, zip, country } = req.body;
  if (!name || !line1 || !city || !state || !zip || !country) {
    return res.status(400).json({ message: 'All address fields are required' });
  }
  
  try {
    const newAddress = new Address({ user: req.user._id, name, line1, city, state, zip, country });
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create address: ' + error.message });
  }
});

// Update an address
router.put('/:id', authenticate, async (req, res) => {
  const { name, line1, city, state, zip, country } = req.body;
  if (!name || !line1 || !city || !state || !zip || !country) {
    return res.status(400).json({ message: 'All address fields are required' });
  }
  
  try {
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, line1, city, state, zip, country },
      { new: true, runValidators: true } // Ensures that validation rules are applied
    );
    
    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    res.json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update address: ' + error.message });
  }
});

// Delete an address
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deletedAddress = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address deleted successfully', deletedAddress });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete address: ' + error.message });
  }
});

module.exports = router;
