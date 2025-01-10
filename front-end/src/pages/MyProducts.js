import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Dashboardlayout';
import AddProductForm from './AddProductForm';
import '../styles/AddProductForm.css';
import { fetchMyProducts, deleteProduct } from '../api'; // Assuming you have a deleteProduct function
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog'; // Import the modal component

function MyProducts() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // To control the delete modal
  const [productToDelete, setProductToDelete] = useState(null); // Store the product ID to delete

  // Fetch products from the server
  const fetchProducts = async () => {
    try {
      const data = await fetchMyProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError(error.message);
    }
  };

  const handleDelete = (productId) => {
    setProductToDelete(productId); // Set the product to delete
    setShowDeleteConfirmation(true); // Show the confirmation modal
  };

  const handleConfirmDelete = async () => {
    setError(null); // Clear any previous error message

    try {
      await deleteProduct(productToDelete); // Call the API to delete the product
      fetchProducts(); // Refresh the product list
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Failed to delete product:", error);
      setError(error.message || "Failed to delete product."); // Set error message
    }
  };
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false); // Close the modal if cancelled
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProductClick = () => {
    setSelectedProduct(null); 
    setShowAddProduct(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product); // Set the selected product to edit
    setShowAddProduct(true);
  };

  const handleBackClick = () => {
    setShowAddProduct(false);
  };

  return (
    <DashboardLayout>
      <div className="my-products-page">
        {showAddProduct ? (
          <AddProductForm 
            onBack={handleBackClick} 
            onProductAdded={fetchProducts} 
            product={selectedProduct} 
          />
        ) : (
          <>
            <div className="my-products-header">
              <h2>My Products</h2>
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
              <button onClick={handleAddProductClick} className="add-product-button-initial">
                <img src="/assets/icons/Plus circle.svg" alt="Add" className="button-icon" /> 
                Add Product
              </button>
            </div>
            <main className="content">
              <div className="equipment-grid">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div className="equipment-card" key={product._id}>
                      <div
                        className="delete-icon"
                        onClick={() => handleDelete(product._id)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#000000"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </div>
                      <h4>{product.name}</h4>
                      <p className="equipment-type">{product.subCategory}</p>
                      <img
                        src={`https://rentez-w8lz.onrender.com/${product.images[0].replace(/\\/g, '/')}`}
                        alt={product.name}
                        className="equipment-image"
                      />
                      <div className="equipment-location">
                        <svg
                          width="14"
                          height="14"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <span>{product.location} {product.district}</span>
                      </div>
                      <div className="equipment-rentaldays">
                        <svg
                          width="14"
                          height="14"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                        </svg>
                        <span>Minimum Rental Days :{product.rentalDays}</span>
                      </div>
                      <p className="equipment-price">₹{product.price} / Day</p>
                      <button onClick={() => handleEditClick(product)} className="rent-now-button">Edit</button>
                    </div>
                  ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            </main>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={showDeleteConfirmation}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  );
}

export default MyProducts;
