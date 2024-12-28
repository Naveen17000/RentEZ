const Product = require('../models/Product'); // Adjust the path as necessary

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  const { name, description, price, available, quantity, specification, image } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      available,
      quantity,
      specification,
      image,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, available, quantity, specification, image } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, available, quantity, specification, image },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all functions
module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
