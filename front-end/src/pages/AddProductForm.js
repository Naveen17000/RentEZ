import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/AddProductForm.css';

function AddProductForm({ onBack, onProductAdded, product }) {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [rentalDays, setRentalDays] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [location, setLocation] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);

  const navigate = useNavigate();

  // Image Upload Handling
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      src: URL.createObjectURL(file),
      file: file,
      isURL: false
    }));
    setProductImages(prevImages => [...prevImages, ...files]);
  };

  // Remove Image Handling
  const handleRemoveImage = (index) => {
    const imageToRemove = productImages[index];
    if (imageToRemove.isURL) {
      setRemovedImages(prev => [...prev, imageToRemove.src]);
    }
    setProductImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // Specification Handlers
  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index][field] = value;
    setSpecifications(updatedSpecs);
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const handleRemoveSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // Reset Form Fields
  const handleDiscard = () => {
    setProductName("");
    setProductDescription("");
    setCategory("");
    setSubCategory("");
    setRentalDays("");
    setPrice("");
    setCompareAtPrice("");
    setLocation("");
    setDistrict("");
    setCity("");
    setPincode("");
    setProductImages([]);
    setRemovedImages([]);
    setSpecifications([{ key: "", value: "" }]); // Reset to an empty array with one default row
  };

  // Navigate Back
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard/my-products');
    }
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', productDescription);
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('rentalDays', rentalDays);
    formData.append('price', price);
    formData.append('compareAtPrice', compareAtPrice);
    formData.append('location', location);
    formData.append('district', district);
    formData.append('city', city);
    formData.append('pincode', pincode);
    formData.append('available', 'true');
    formData.append('quantity', '1');
    // Append images
    const newImages = productImages.filter(image => !image.isURL);
    newImages.forEach((image) => {
      formData.append('image', image.file);
    });

    // Append removed images
    formData.append('removedImages', JSON.stringify(removedImages));

    // Append specifications
    formData.append('specifications', JSON.stringify(specifications));

    try {
      if (product) {
        // Update existing product
        await updateProduct(product._id, formData);
      } else {
        // Create new product
        await createProduct(formData);
      }
      onProductAdded();
      onBack();
    } catch (error) {
      console.error("Failed to add/update product:", error);
      alert(error.message || "Failed to add/update product");
    }
  };

  // Populate fields when editing a product
  useEffect(() => {
    if (product) {
      setProductName(product.name || "");
      setProductDescription(product.description || "");
      setCategory(product.category || "");
      setSubCategory(product.subCategory || "");
      setRentalDays(product.rentalDays || "");
      setPrice(product.price || "");
      setCompareAtPrice(product.compareAtPrice || "");
      setLocation(product.location || "");
      setDistrict(product.district || "");
      setCity(product.city || "");
      setPincode(product.pincode || "");
      setSpecifications(product.specification || [{ key: "", value: "" }]);

      if (product.images && product.images.length > 0) {
        setProductImages(product.images.map(image => ({
          src: `http://localhost:5000/${image.replace(/\\/g, '/')}`,
          isURL: true
        })));
      } else {
        setProductImages([]);
      }
    } else {
      handleDiscard();
    }
  }, [product]);

  return (
    <div className="container">
      <main className="form-container">
        <form className="add-product-form" onSubmit={handleSubmit}>
          <button type="button" className="back-button" onClick={handleBack}>Back</button>
          <h2>{product ? "Edit Product" : "Add New Product"}</h2>

          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Electric Stacker"
              required
            />
          </div>

          <div className="form-group">
            <label>Product Description</label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Enter product description here"
              required
            />
          </div>

          <div className="form-group specification-container">
  <label>Product Specifications</label>
  {specifications.map((spec, index) => (
    <div key={index} className="specification-input">
      <input
        type="text"
        placeholder="Key (e.g., Power)"
        value={spec.key}
        onChange={(e) => handleSpecificationChange(index, "key", e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Value (e.g., 500W)"
        value={spec.value}
        onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
        required
      />
      <button type="button" onClick={() => handleRemoveSpecification(index)}>
        Remove
      </button>
    </div>
  ))}
  <button
    type="button"
    className="add-specification-button"
    onClick={handleAddSpecification}
  >
    Add Specification
  </button>
</div>

          <div className="form-group">
            <label>Product Images</label>
            <label className="custom-file-upload">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                required={!product}
              />
              Click to upload or drag and drop
            </label>
            <div className="images-preview">
              {productImages.map((image, index) => (
                <div key={index} className="image-container">
                  <img src={image.src} alt={`Product ${index + 1}`} />
                  <button type="button" className="remove-image-button" onClick={() => handleRemoveImage(index)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Product Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            <option value="Electric">Electric</option>
            <option value="Manual">Manual</option>
            <option value="Hydraulic">Hydraulic</option>
            <option value="Pneumatic">Pneumatic</option>
            <option value="Diesel">Diesel</option>
            <option value="Battery Operated">Battery Operated</option>
            <option value="Gasoline">Gasoline</option>
            </select>
            <label>Subcategory</label>
            <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required>
            <option value="">Select Subcategory</option>
            <option value="Stacker">Stacker</option>
            <option value="Forklift">Forklift</option>
            <option value="Pallet Jack">Pallet Jack</option>
            <option value="Tow Tractor">Tow Tractor</option>
            <option value="Reach Truck">Reach Truck</option>
            <option value="Order Picker">Order Picker</option>
            <option value="Scissor Lift">Scissor Lift</option>
            <option value="Concrete Hammer">Concrete Hammer</option>
            <option value="Driller">Driller</option>
            <option value="Mixer">Mixer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Min. Rental Days</label>
            <input
              type="number"
              value={rentalDays}
              onChange={(e) => setRentalDays(e.target.value)}
              placeholder="10"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="State"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Pricing</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="600.00"
              required
            />
            <input
              type="number"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="800.00"
            />
          </div>

          <div className="form-buttons">
            <button type="button" className="discard-button" onClick={handleDiscard}>Discard</button>
            <button type="submit" className="add-product-button">
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddProductForm;
