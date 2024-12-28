const express = require('express');
const Order = require('../models/rentalRequest');
const User = require('../models/User');
const Product = require('../models/Product'); // Correct the model reference
const router = express.Router();

// Route to get the total number of users
router.get('/user-count', async (req, res) => {
  try {
    const userCount = await User.countDocuments({});
    res.status(200).json({ count: userCount });
  } catch (err) {
    console.error('Error fetching user count:', err);
    res.status(500).json({ error: 'Error fetching user count' });
  }
});

// Route to get the total number of users created this month
router.get('/user-count-month', async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const userCountForMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    res.status(200).json({ count: userCountForMonth });
  } catch (err) {
    console.error('Error fetching user count for the current month:', err);
    res.status(500).json({ error: 'Error fetching user count for the current month' });
  }
});

// Route to get the count of returned sales
router.get('/sales/count', async (req, res) => {
  try {
    const returnedSalesCount = await Order.countDocuments({ status: 'Returned' });
    res.status(200).json({ count: returnedSalesCount });
  } catch (error) {
    console.error('Error fetching sales count:', error);
    res.status(500).json({ error: 'Failed to count sales' });
  }
});

// Route to get recent sales
router.get('/sales/recent', async (req, res) => {
  try {
    // Fetch recent sales (for example, all orders with a "Delivered" status)
    const recentSales = await Order.find({
      status: { $in: ['Pending', 'Ordered', 'Rejected', 'Payment', 'Shipped', 'Delivered', 'Returned','Canceled'] }, 
    })
      .populate('productId', 'name price') // Populate product details
      .populate('customerId', 'firstName lastName'); // Populate customer details

    if (!recentSales.length) {
      return res.status(404).json({ message: 'No recent sales found' });
    }

    res.status(200).json(recentSales);
  } catch (error) {
    console.error('Error fetching recent sales:', error);
    res.status(500).json({ message: 'Failed to fetch recent sales', error: error.message });
  }
});
// Route to fetch top products
router.get('/products/top', async (req, res) => {
  try {
    const topProducts = await Product.find({}, 'name price images')
      .sort({ price: -1 })
      .limit(6);

    res.status(200).json(topProducts);
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ message: 'Failed to fetch top products', error: error.message });
  }
});

// Route to calculate total revenue
router.get('/products/revenue', async (req, res) => {
  try {
    const revenueData = await Order.aggregate([
      {
        $match: { status: { $in: ['Payment', 'Shipped', 'Delivered', 'Returned'] } }, // Include multiple statuses
      },
      {
        $lookup: {
          from: 'products', // Product collection
          localField: 'productId',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails',
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$productDetails.price', 0.1] } }, // Calculate 10% of each product price and sum it
        },
      },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    res.status(200).json({ revenue: totalRevenue });
  } catch (error) {
    console.error('Error calculating revenue:', error);
    res.status(500).json({ message: 'Failed to calculate revenue', error: error.message });
  }
});

router.get('/activities/recent', async (req, res) => {
  try {
      const recentUsers = await User.find({}, 'username createdAt')
          .sort({ createdAt: -1 })
          .limit(5);

      const recentProducts = await Product.find({}, 'name createdAt') // Correct the model reference
          .sort({ createdAt: -1 })
          .limit(5);

      const recentOrders = await Order.find({}, 'orderId status orderDate')
          .sort({ orderDate: -1 })
          .limit(5)
          .populate('productId', 'name')
          .populate('customerId', 'username');

      const activities = [
          ...recentUsers.map(user => ({
              time: user.createdAt,
              type: 'User',
              description: `User account created: ${user.username}`,
          })),
          ...recentProducts.map(product => ({
              time: product.createdAt,
              type: 'Product',
              description: `Product added: ${product.name}`,
          })),
          ...recentOrders.map(order => ({
              time: order.orderDate,
              type: 'Order',
              description: `Order ${order.orderId} is ${order.status} (Product: ${order.productId?.name})`,
          })),
      ];

      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      res.status(200).json(activities);
  } catch (error) {
      console.error('Error fetching recent activities:', error);
      res.status(500).json({ message: 'Failed to fetch recent activities', error: error.message });
  }
});

module.exports = router;
