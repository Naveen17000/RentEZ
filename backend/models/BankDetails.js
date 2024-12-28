// backend/models/BankDetails.js
const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accountHolder: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  ifsc: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('BankDetails', bankDetailsSchema);
