const express = require('express');
const path = require('path');
const router = express.Router();
const RentalRequest = require('../models/rentalRequest');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/authMiddleware'); 

router.get('/dashboard-stats', authenticate, async (req, res) => {
    try {
      const totalProducts = await Product.countDocuments({ userId: req.user._id });
      const totalOrders = await RentalRequest.countDocuments({ supplierId: req.user._id });
      const productsRented = await RentalRequest.countDocuments({ supplierId: req.user._id, status: 'Delivered' });
      const tasksPending = await RentalRequest.countDocuments({ supplierId: req.user._id, status: 'Pending' });
  
      const stats = [
        { label: "Total Products", value: totalProducts, image: "/index-1.jpg" },
        { label: "Total Orders", value: totalOrders, image: "/index-2.jpg" },
        { label: "Products Rented", value: productsRented, image: "/index-3.jpg" },
        { label: "Tasks Pending", value: tasksPending, image: "/index-4.jpg" },
      ];
  
      res.json(stats);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
  });
  
  // Route to get sales data
  router.get('/sales-data', authenticate, async (req, res) => {
    try {
      const salesData = await RentalRequest.aggregate([
        { $match: { supplierId: req.user._id } },
        { $group: { _id: { $dayOfWeek: "$fromDate" }, sales: { $sum: 1 } } },
        { $sort: { "_id": 1 } }
      ]);
  
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const formattedSalesData = salesData.map(data => ({
        day: daysOfWeek[data._id - 1],
        sales: data.sales
      }));
  
      res.json(formattedSalesData);
    } catch (err) {
      console.error('Error fetching sales data:', err);
      res.status(500).json({ message: 'Failed to fetch sales data' });
    }
  });
  
  // Route to get top products
  router.get('/top-products', authenticate, async (req, res) => {
    try {
      const topProducts = await RentalRequest.aggregate([
        { $match: { supplierId: req.user._id } },
        { $group: { _id: "$productId", rentals: { $sum: 1 } } },
        { $sort: { rentals: -1 } },
        { $limit: 5 },
        { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
        { $unwind: "$product" },
        { $project: { name: "$product.name", rentals: 1 } }
      ]);
  
      res.json(topProducts);
    } catch (err) {
      console.error('Error fetching top products:', err);
      res.status(500).json({ message: 'Failed to fetch top products' });
    }
  });
  
  // Route to get total sales
  router.get('/total-sales', authenticate, async (req, res) => {
    try {
      const totalSales = await RentalRequest.aggregate([
        { $match: { supplierId: req.user._id, status: { $in: ['Payment', 'Shipped', 'Delivered'] } } }, // Ensure only completed sales are counted
        { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
        { $project: {
            pricePerDay: '$product.price',
            rentalDays: { $divide: [{ $subtract: ['$endDate', '$fromDate'] }, 1000 * 60 * 60 * 24] } // Calculate rental days
        }},
        { $group: { _id: null, total: { $sum: { $multiply: ['$pricePerDay', '$rentalDays'] } } } }
      ]);
  
      res.json(totalSales[0]?.total || 0);
    } catch (err) {
      console.error('Error fetching total sales:', err);
      res.status(500).json({ message: 'Failed to fetch total sales' });
    }
  });

  
  

  module.exports = router;