const Product = require('../models/Product');

// Fetch all products
const fetchProducts = async () => {
  return await Product.find();
};

// Add a new product
const addProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

module.exports = {
  fetchProducts,
  addProduct,
};
