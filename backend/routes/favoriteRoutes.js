const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const { authenticate } = require('../middleware/authMiddleware');

// Get all favorites for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user._id; // Ensure `req.user._id` is correctly populated
    const favorites = await Favorite.find({ userId })
      .populate('equipmentId', 'name category subCategory rentalDays price location district images quantity createdAt') // Add more fields to populate
      .select('equipmentId -_id'); // Only include equipmentId
    
    res.json(favorites.map(fav => fav.equipmentId)); // Send full equipment data in response
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json({ message: 'Error fetching favorites', error: error.message });
  }
}); 

// Update favorite status
router.post('/', authenticate, async (req, res) => {
  const { equipmentId, isFavorite } = req.body;
  const userId = req.user.id;

  try {
    if (!equipmentId) {
      return res.status(400).json({ message: "Missing equipmentId" });
    }

    if (isFavorite) {
      // Add to favorites if it doesn't exist
      await Favorite.findOneAndUpdate(
        { userId, equipmentId },
        { userId, equipmentId },
        { upsert: true, new: true }
      );
    } else {
      // Remove from favorites
      await Favorite.deleteOne({ userId, equipmentId });
    }
    res.json({ message: 'Favorite updated successfully', isFavorite });
  } catch (error) {
    console.error('Error updating favorite:', error);
    res.status(500).json({ message: 'Error updating favorite', error: error.message });
  }
});


// Get a single favorite status
router.get('/:equipmentId', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const equipmentIdNumber = Number(req.params.equipmentId);
    
    if (isNaN(equipmentIdNumber)) {
      return res.status(400).json({ message: "Invalid equipmentId format" });
    }

    const favorite = await Favorite.findOne({ userId, equipmentId: equipmentIdNumber });
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ message: 'Error checking favorite status', error: error.message });
  }
});

module.exports = router;
