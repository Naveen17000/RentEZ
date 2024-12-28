const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      }
    ],
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, default: 'Pending' }, // e.g., Pending, Shipped, Delivered
    orderDate: { type: Date, default: Date.now }
  });
  
  const Order = mongoose.model('Order', OrderSchema);
  module.exports = Order;
  