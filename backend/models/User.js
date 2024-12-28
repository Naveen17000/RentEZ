const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // Enable timestamps
);
const User = mongoose.model('User', UserSchema);

module.exports = User;
