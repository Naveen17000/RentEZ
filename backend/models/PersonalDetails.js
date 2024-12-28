const mongoose = require('mongoose');

const personalDetailsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  companyName: { type: String, required: false },
  country: { type: String, required: true },
});

module.exports = mongoose.model('PersonalDetails', personalDetailsSchema);
