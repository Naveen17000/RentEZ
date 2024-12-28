const express = require('express');
const PersonalDetails = require('../models/PersonalDetails');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

// Get personal details for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const personalDetails = await PersonalDetails.findOne({ user: req.user._id });

    if (!personalDetails) {
      return res.status(404).json({ message: 'Personal details not found' });
    }
    res.json(personalDetails);
  } catch (error) {
    console.error('Error retrieving personal details:', error);
    res.status(500).json({ message: 'Failed to retrieve personal details', error: error.message });
  }
});

// Add new personal details
router.post('/', authenticate, async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phoneNumber, 
      gender, 
      companyName, 
      country 
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'firstName', 
      'lastName', 
      'email', 
      'phoneNumber', 
      'gender', 
      'country'
    ];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        missingFields 
      });
    }

    // Check if personal details already exist
    const existingDetails = await PersonalDetails.findOne({ user: req.user._id });
    if (existingDetails) {
      return res.status(400).json({ message: 'Personal details already exist for this user' });
    }

    // Prepare personal details data
    const personalDetailsData = {
      user: req.user._id,
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      companyName,
      country
    };

    // Create and save new personal details
    const newPersonalDetails = new PersonalDetails(personalDetailsData);
    const savedPersonalDetails = await newPersonalDetails.save();

    res.status(201).json(savedPersonalDetails);
  } catch (error) {
    console.error('Error creating personal details:', error);
    res.status(500).json({ 
      message: 'Failed to create personal details', 
      error: error.message 
    });
  }
});

// Update personal details
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phoneNumber, 
      gender, 
      companyName, 
      country 
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'firstName', 
      'lastName', 
      'email', 
      'phoneNumber', 
      'gender', 
      'country'
    ];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        missingFields 
      });
    }

    // Find the personal details to update
    const personalDetails = await PersonalDetails.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!personalDetails) {
      return res.status(404).json({ message: 'Personal details not found' });
    }

    // Update fields
    personalDetails.firstName = firstName;
    personalDetails.lastName = lastName;
    personalDetails.email = email;
    personalDetails.phoneNumber = phoneNumber;
    personalDetails.gender = gender;
    personalDetails.companyName = companyName;
    personalDetails.country = country;

    // Save updated personal details
    const updatedPersonalDetails = await personalDetails.save();
    res.json(updatedPersonalDetails);
  } catch (error) {
    console.error('Error updating personal details:', error);
    res.status(500).json({ 
      message: 'Failed to update personal details', 
      error: error.message 
    });
  }
});

// Delete personal details
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deletedPersonalDetails = await PersonalDetails.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!deletedPersonalDetails) {
      return res.status(404).json({ message: 'Personal details not found' });
    }

    res.json({ 
      message: 'Personal details deleted successfully', 
      deletedPersonalDetails 
    });
  } catch (error) {
    console.error('Error deleting personal details:', error);
    res.status(500).json({ 
      message: 'Failed to delete personal details', 
      error: error.message 
    });
  }
});

module.exports = router;