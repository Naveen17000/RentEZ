const PersonalDetails = require('../models/PersonalDetails');

// Get personal details for the authenticated user
const getPersonalDetails = async (req, res) => {
  try {
    const personalDetails = await PersonalDetails.findOne({ user: req.user._id });
    if (!personalDetails) {
      return res.status(404).json({ message: 'Personal details not found' });
    }
    res.json(personalDetails);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve personal details: ' + error.message });
  }
};

// Create personal details for the authenticated user
const createPersonalDetails = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, gender, companyName, country, profilePhoto } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !gender || !country) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  try {
    const existingDetails = await PersonalDetails.findOne({ user: req.user._id });
    if (existingDetails) {
      return res.status(400).json({ message: 'Personal details already exist for this user' });
    }

    const newPersonalDetails = new PersonalDetails({
      user: req.user._id,
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      companyName,
      country,
      profilePhoto,
    });

    await newPersonalDetails.save();
    res.status(201).json(newPersonalDetails);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create personal details: ' + error.message });
  }
};

// Update personal details for the authenticated user
const updatePersonalDetails = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, gender, companyName, country, profilePhoto } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !gender || !country) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  try {
    const updatedDetails = await PersonalDetails.findOneAndUpdate(
      { user: req.user._id },
      { firstName, lastName, email, phoneNumber, gender, companyName, country, profilePhoto },
      { new: true, runValidators: true }  // Ensures validation and gets the updated data
    );

    if (!updatedDetails) {
      return res.status(404).json({ message: 'Personal details not found' });
    }

    res.json(updatedDetails);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update personal details: ' + error.message });
  }
};

// Delete personal details for the authenticated user
const deletePersonalDetails = async (req, res) => {
  try {
    const deletedDetails = await PersonalDetails.findOneAndDelete({ user: req.user._id });

    if (!deletedDetails) {
      return res.status(404).json({ message: 'Personal details not found' });
    }

    res.json({ message: 'Personal details deleted successfully', deletedDetails });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete personal details: ' + error.message });
  }
};

module.exports = {
  getPersonalDetails,
  createPersonalDetails,
  updatePersonalDetails,
  deletePersonalDetails,
};
