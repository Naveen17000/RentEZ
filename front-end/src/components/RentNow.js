import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RelatedProducts from '../components/RelatedProducts';
import SimilarProductsSection from '../components/SimilarProducts';
import '../styles/Rentnow.css';
import { fetchProduct, fetchAddresses, createRentalRequest, fetchUnavailableDates } from '../api';
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";

const RentNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [addresses, setAddresses] = useState([]); // State for storing addresses
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [fromTime, setFromTime] = useState('');
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const isLoggedIn = !!sessionStorage.getItem('authToken');
  const [availability, setAvailability] = useState({
    available: [],
    unavailable: []
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetchProduct(id);
        console.log('Fetched product:', response);

        if (!response || !response.name) {
          throw new Error('Product not found');
        }

        setProduct(response);

        if (response.images && response.images.length > 0) {
          setSelectedImage(response.images[0]);
        } else if (response.image) {
          setSelectedImage(response.image);
        }
        setSelectedProductId(response._id);
      } catch (error) {
        console.error('Error loading product:', error.message);
      }
    };

    loadProduct();
  const loadAddresses = async () => {
    try {
      const data = await fetchAddresses();
      setAddresses(data); // Store fetched addresses
      if (data.length > 0) {
        setSelectedAddress(data[0]._id); // Default to the first address
      }
    } catch (error) {
      console.error("Error loading addresses:", error.message);
    }
  };
  loadAddresses();

  const loadUnavailableDates = async () => {
    try {
      const data = await fetchUnavailableDates(id); // Fetch unavailable dates for the product
      setAvailability((prev) => ({ ...prev, unavailable: data }));
    } catch (error) {
      console.error("Error loading unavailable dates:", error.message);
    }
  };

  loadUnavailableDates();
}, [id]);

const isUnavailable = (date) => {
  return availability.unavailable.includes(date.toISOString().split('T')[0]);
};

const handleAddressChange = (e) => {
  setSelectedAddress(e.target.value);
};
  const handleRentNowInitialClicked = () => {
    if (isLoggedIn) {
      setIsPopupVisible(true);
    } else {
      alert("Please log in to rent the product.");
    }
  };

  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="date-input-wrapper" ref={ref}>
      <input
        type="text"
        value={value}
        readOnly
        className="date-input"
        placeholder="Select a date"
        onClick={onClick} // Trigger calendar when input is clicked
      />
      <FaCalendarAlt className="calendar-icon" onClick={onClick} /> {/* Calendar icon */}
    </div>
  ));

  const handleRentNow = async () => {
    const requestData = {
      productId: selectedProductId, // ID of the product to be rented
      customerId: sessionStorage.getItem('userId'), // Assuming userId is stored in sessionStorage
      supplierId: product.supplierId, // Assuming supplierId is part of the product data
      category: product.category,
      selectedAddress,
      phoneNumber: sessionStorage.getItem('phoneNumber'), // Assuming phoneNumber is stored in sessionStorage
      fromDate,
      fromTime,
      endDate,
      endTime,
      orderDate: new Date().toISOString().split('T')[0], // Current date
    };
  
    try {
      console.log("Sending rental request with data:", requestData); // Debugging log
      const response = await createRentalRequest(requestData);
      console.log("Rental request sent successfully:", response);
      setIsSuccessPopupVisible(true); // Show success popup
    } catch (error) {
      console.error("Failed to send rental request:", error.message);
      alert("Failed to send rental request. Please try again.");
    }
  };

  const handleDateChange = (field, value) => {
    if (field === 'fromDate') {
      setFromDate(value);
      calculateTotalDays(value, endDate); // Call to update total days
    } else if (field === 'endDate') {
      setEndDate(value);
      calculateTotalDays(fromDate, value); // Call to update total days
    } else if (field === 'fromTime') {
      setFromTime(value);
    } else if (field === 'endTime') {
      setEndTime(value);
    }
  };
  
  const calculateTotalDays = (from, end) => {
    if (from && end) {
      const start = new Date(from);
      const finish = new Date(end);
  
      if (isNaN(start) || isNaN(finish)) {
        setTotalDays("Invalid date or time input");
        return;
      }
  
      const timeDifference = finish - start;
      const totalDays = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
  
      if (totalDays < 0) {
        setTotalDays("End date must be after start date");
      } else {
        setTotalDays(totalDays); // Update the state with the total number of days
      }
    }
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
    resetPopupFields();
  };

  const resetPopupFields = () => {
    setFromDate(null);
    setFromTime('');
    setEndDate(null);
    setEndTime('');
    setTotalDays(0);
  };

  const successbtn = () => {
    calculateTotalDays();
    navigate('/dashboard/my-orders');
  }

  const handleSuccessPopupClose = () => {
    setIsSuccessPopupVisible(false);
    setIsPopupVisible(false);
    resetPopupFields();
  };

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('fullscreen-backdrop')) {
      setIsFullScreen(false);
    }
  };

  const handleReadMore = () => {
    setIsExpanded(!isExpanded);
  };  

  
  if (!product) {
    return <div>Product not found</div>;
  }

  const tabContent = {
    description: <p className="description">{product.description}</p>,
    specifications: (
      <ul className="specifications">
        {product.specification && product.specification.length > 0 ? (
          product.specification.map((spec, index) => (
            <li key={index} className="spec-item">
              <span className="spec-key">{spec.key}:</span> <span className="spec-value">{spec.value}</span>
            </li>
          ))
        ) : (
          <li className="no-specifications">No specifications available</li>
        )}
      </ul>
    ),
    reviews: (
      <div className="reviews">
        <h4>User Reviews:</h4>
        <div className="review">
          <p className="review-text">★★★★☆ - Great product! Very effective.</p>
        </div>
        <div className="review">
          <p className="review-text">★★★★★ - Worth every penny! Highly recommend.</p>
        </div>
        <div className="review">
          <p className="review-text">★★★☆☆ - Good but could be better.</p>
        </div>
      </div>
    ),
  };

  return (
    <div className="product-page">
      {/* Fullscreen Image Popup */}
      {isFullScreen && (
        <div 
          className="fullscreen-backdrop" 
          onClick={handleBackdropClick}
        >
          <div className="fullscreen-content">
            <button 
              className="close-fullscreen" 
              onClick={() => setIsFullScreen(false)}
            >
            </button>
            <img 
              src={
                selectedImage
                  ? `http://localhost:5000/${selectedImage.replace(/\\/g, '/')}`
                  : product.image
                  ? `http://localhost:5000/${product.image.replace(/\\/g, '/')}`
                  : '/placeholder.jpg'
              }
              alt={product.name} 
              className="fullscreen-image"
            />
          </div>
        </div>
      )}
      

{/* Rent Details Popup */}
{isPopupVisible && !isSuccessPopupVisible && (
  <div className="popup-backdrop" onClick={handlePopupClose}>
    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
      <div className="popup-header">
        <h3>Rent Details</h3>
      </div>
      <div className="popup-body">
        <div className="loc">
          <label>
            <svg
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                top: '3%',
                transform: 'translateY(-50%)',
                fontSize: '20px',
                color: 'grey',
                pointerEvents: 'none',
              }}
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <p className="location">Choose Address:</p>
            <div style={{ position: 'relative', width: '300px' }}>
              <select
                value={selectedAddress}
                onChange={handleAddressChange}
                style={{
                  width: '100%',
                  height: '50px',
                  padding: '10px 10px 10px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <option value="">Select Address</option>
                {addresses.map((address) => (
                  <option
                    key={address._id}
                    value={address._id}
                    style={{
                      fontSize: '12px',
                      maxWidth: '50px',
                      maxHeight: '100%',
                    }}
                  >
                    {address.name}, {address.line1}, {address.city}, {address.state}, {address.zip}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>

      <div className="fd">
      <label>
        From Date: <br />
        <DatePicker
  selected={fromDate}
  onChange={(date) => handleDateChange('fromDate', date)}
  highlightDates={{
    // Highlight available dates if necessary
    "available-dates": availability.available.map((date) => new Date(date)),
  }}
  dayClassName={(date) =>
    isUnavailable(date)
      ? "unavailable-date" // Custom class for unavailable dates
      : ""
  }
  filterDate={(date) => !isUnavailable(date)} // Make unavailable dates non-selectable
  customInput={<CustomDateInput />}
  dateFormat="MMMM d, yyyy"
  minDate={new Date()} // Prevent past dates from being selected
/>
      </label>
    </div>

        <div className="fd-time">
          <label>
            <input
              type="time"
              value={fromTime}
              onChange={(e) => handleDateChange('fromTime', e.target.value)}
            />
          </label>
        </div>
        <div className="ed">
          <label>
            End Date: <br />
            <DatePicker
  selected={endDate}
  onChange={(date) => handleDateChange('endDate', date)}
  highlightDates={{
    // Highlight available dates if necessary
    "available-dates": availability.available.map((date) => new Date(date)),
  }}
  dayClassName={(date) =>
    isUnavailable(date)
      ? "unavailable-date" // Custom class for unavailable dates
      : ""
  }
  filterDate={(date) => !isUnavailable(date)} // Make unavailable dates non-selectable
  customInput={<CustomDateInput />}
  dateFormat="MMMM d, yyyy"
  minDate={new Date()} // Prevent past dates from being selected
/>
          </label>
        </div>
        <div className="ed-time">
          <label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => handleDateChange('endTime', e.target.value)}
            />
          </label>
        </div>

        <div className="Minrtd">
          <p>Minimum Rental Days: {product.rentalDays}</p>
        </div>

        <div className="close-popup-btn">
          <span>₹{product.price}</span>
        </div>
        <button
          className="bttn"
          onClick={() => handleRentNow()}
        >
          Rent Now
        </button>
      </div>
    </div>
  </div>
)}

{/* Success Popup */}
{isSuccessPopupVisible && (
  <div
  className="popup-backdrop success"
  onClick={(e) => {
    e.stopPropagation(); // Prevent the click from bubbling up
    handleSuccessPopupClose(); // Close the popup
  }}
>
    <div className="popup-content-success-content" onClick={(e) => e.stopPropagation()}>
      <div className="popup-header">
        <h3>Success!</h3>
      </div>
      <div className="popupp-body">
        <img
          src={
            selectedImage
              ? `http://localhost:5000/${selectedImage.replace(/\\/g, '/')}`
              : product.image
              ? `http://localhost:5000/${product.image.replace(/\\/g, '/')}`
              : '/placeholder.jpg'
          }
          alt={product.name}
          className="producct-image"
        />
        <p className="tot-rent-dd">{product.name}</p>
        <p className="tot-rent-d">Total Rental Days: <strong>{totalDays}</strong></p>
        <p className="tot-rent-ddd">{product.location}</p>
        <p className="tot-rent-dddd">{product.price}</p>
        <h2>Thank You for Your Purchase!</h2>
        <p>Your order has been sent to the supplier. View orders for status updates.</p>
        <button className="success-btn" onClick={successbtn}>
          View Orders
        </button>
      </div>
    </div>
  </div>
)}





<main>
  <div className="product-details">
    <div className="product-images">
      <div className="thumbnail-images">
        {product.images.map((image, index) => (
          <img
            key={index}
            src={`http://localhost:5000/${image.replace(/\\/g, '/')}`} // Fix image path
            alt={`Product thumbnail ${index}`}
            onClick={() => handleThumbnailClick(image)} // Set the selected image
            className={selectedImage === image ? 'selected-thumbnail' : ''}
          />
        ))}
      </div>

      <div
        className={`product-image ${isFullScreen ? 'fullscreen' : ''}`}
        style={{
          width: isFullScreen ? '100%' : '700px',
          height: isFullScreen ? '100%' : '550px',
        }}
        onClick={toggleFullScreen}
      >
        <img
          src={
            selectedImage
              ? `http://localhost:5000/${selectedImage.replace(/\\/g, '/')}`
              : product.image
              ? `http://localhost:5000/${product.image.replace(/\\/g, '/')}`
              : '/placeholder.jpg'
          }
          alt={product.name || 'Product Image'}
          className="main-image"
        />
      </div>

            <div className="product-info">
              <h2>{product.name}</h2>
              <h3>{product.category}</h3>
              <p className="product-rating">★★★★★&nbsp;&nbsp;&nbsp;&nbsp; 1000+ reviews</p>
              <p className="description-1">
  {isExpanded ? product.description : `${product.description.substring(0, 200)}...`}
  {product.description.length > 200 && (
    <span className="read-more" onClick={handleReadMore}>
      {isExpanded ? "Read Less" : "Read More"}
    </span>
  )}
</p>
<p>INR (incl. of all taxes)</p>
<p className="supplier-contact">Supplier Contact: {product.supplierContact}</p> {/* Added supplier contact */}
<div className="price-button-container">
              
              <p className="product-price">₹{product.price} / Day</p>
              <button className="rent-now-btn" onClick={handleRentNowInitialClicked}>
                Rent Now
              </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="tab-buttons">
          <button
            className={activeTab === 'description' ? 'active' : ''}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={activeTab === 'specifications' ? 'active' : ''}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button
            className={activeTab === 'reviews' ? 'active' : ''}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>

        {/* Tab content */}
        <div className="tab-content">{tabContent[activeTab]}</div>
        </main>
        <SimilarProductsSection productId={product._id} category={product.subCategory} />
        <p className="rlt">Related Products</p>
        <RelatedProducts productId={id} />
      </div>
  );
};

export default RentNow;