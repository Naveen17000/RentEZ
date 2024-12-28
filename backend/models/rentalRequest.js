const mongoose = require('mongoose');

const rentalRequestSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: true, unique: true }, // Add orderId field
  category: { type: String, required: true },
  selectedAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  fromDate: { type: Date, required: true },
  fromTime: { type: String, required: true },
  endDate: { type: Date, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Ordered', 'Rejected', 'Payment', 'Shipped', 'Delivered', 'Returned','Canceled'], default: 'Pending' },
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  orderDate: { type: Date, required: true } // Add orderDate field
}, { timestamps: true });

module.exports = mongoose.model('RentalRequest', rentalRequestSchema);