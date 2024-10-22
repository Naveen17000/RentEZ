const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

// Get all equipment
router.get('/', async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new equipment
router.post('/', async (req, res) => {
  const equipment = new Equipment({
    name: req.body.name,
    category: req.body.category,
    pricePerDay: req.body.pricePerDay,
  });
  try {
    const newEquipment = await equipment.save();
    res.status(201).json(newEquipment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
