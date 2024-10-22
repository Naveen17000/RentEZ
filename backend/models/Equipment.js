const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Equipment', equipmentSchema);
