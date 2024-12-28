const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, trim: true },
    subCategory: { type: String, trim: true },
    rentalDays: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    location: { type: String, trim: true },
    district: { type: String, trim: true },
    city: { type: String, trim: true },
    pincode: { type: String, trim: true, match: /^[0-9]{6}$/ },
    available: { type: Boolean, default: true },
    quantity: { type: Number, default: 1, min: 0 },
    images: { type: [String], default: [] },
    specification: [
      {
        key: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true }
      }
    ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    supplierContact: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{10}$/
    },
    rentalCount: { type: Number, default: 0, min: 0 } // Track the number of rentals for the product
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
