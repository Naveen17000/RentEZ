const BankDetails = require('../models/BankDetails');

// Get bank details for the logged-in user
const getBankDetails = async (req, res) => {
  try {
    const bankDetails = await BankDetails.find({ user: req.user.id }); // Filter by logged-in user's ID
    res.json(bankDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bank details', error });
  }
};

// Add new bank details for the logged-in user
const addBankDetails = async (req, res) => {
  try {
    const newBankDetails = await BankDetails.create({ ...req.body, user: req.user.id }); // Associate with user's ID
    res.status(201).json(newBankDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error adding bank details', error });
  }
};

// Update bank details if they belong to the logged-in user
const updateBankDetails = async (req, res) => {
  try {
    const bankDetails = await BankDetails.findOne({ _id: req.params.id, user: req.user.id }); // Find by ID and user
    if (!bankDetails) {
      return res.status(404).json({ message: 'Bank details not found' });
    }
    Object.assign(bankDetails, req.body); // Update bank details fields
    await bankDetails.save();
    res.json(bankDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error updating bank details', error });
  }
};

// Delete bank details if they belong to the logged-in user
const deleteBankDetails = async (req, res) => {
  try {
    const bankDetails = await BankDetails.findOneAndDelete({ _id: req.params.id, user: req.user.id }); // Find by ID and user
    if (!bankDetails) {
      return res.status(404).json({ message: 'Bank details not found' });
    }
    res.json({ message: 'Bank details deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bank details', error });
  }
};

module.exports = { getBankDetails, addBankDetails, updateBankDetails, deleteBankDetails };
