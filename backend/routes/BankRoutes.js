const express = require('express');
const BankDetails = require('../models/BankDetails');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all bank details for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const bankDetails = await BankDetails.find({ user: req.user._id });
    res.json(bankDetails);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve bank details: ' + error.message });
  }
});

// Add new bank details
router.post('/', authenticate, async (req, res) => {
  const { accountHolder, accountNumber, ifsc, bankName, branch } = req.body;
  if (!accountHolder || !accountNumber || !ifsc || !bankName || !branch) {
    return res.status(400).json({ message: 'All bank details fields are required' });
  }

  try {
    const newBankDetails = new BankDetails({
      user: req.user._id,
      accountHolder,
      accountNumber,
      ifsc,
      bankName,
      branch,
    });
    await newBankDetails.save();
    res.status(201).json(newBankDetails);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add bank details: ' + error.message });
  }
});

// Update bank details
router.put('/:id', authenticate, async (req, res) => {
  const { accountHolder, accountNumber, ifsc, bankName, branch } = req.body;
  if (!accountHolder || !accountNumber || !ifsc || !bankName || !branch) {
    return res.status(400).json({ message: 'All bank details fields are required' });
  }

  try {
    const updatedBankDetails = await BankDetails.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { accountHolder, accountNumber, ifsc, bankName, branch },
      { new: true, runValidators: true } // Ensures validation rules are applied
    );

    if (!updatedBankDetails) {
      return res.status(404).json({ message: 'Bank details not found' });
    }

    res.json(updatedBankDetails);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update bank details: ' + error.message });
  }
});

// Delete bank details
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deletedBankDetails = await BankDetails.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedBankDetails) {
      return res.status(404).json({ message: 'Bank details not found' });
    }
    res.json({ message: 'Bank details deleted successfully', deletedBankDetails });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete bank details: ' + error.message });
  }
});

module.exports = router;
