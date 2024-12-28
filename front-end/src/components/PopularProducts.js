import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchPopularProducts } from '../api'; // Import the correct function
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/EquipmentPage.css'; // Assuming external CSS is used

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const products = await fetchPopularProducts();
        if (products?.length) {
          setProducts(products);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchTopProducts();
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const handleRentNow = (id) => {
    navigate(`/equipment/${id}`);
  };

  return (
    <section className="popular-products">
      <h2>Popular Equipment</h2>
      <p className="section-subtitle">Most frequently rented equipment by our customers</p>
      <div className="scroll-wrapper">
        <button className="scroll-button left" onClick={scrollLeft}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="products-scroll" ref={scrollContainerRef}>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="equipment-card">
                <div className="heart-border">
                </div>
                <h4>{product.name}</h4>
                <p className="equipment-type">{product.category}</p>
                <img
                  src={`http://localhost:5000/${product.images[0] ? product.images[0].replace(/\\/g, '/') : "default-image.jpg"}`}
                  alt={product.name || "Equipment"}
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
                  <span>{product.location}, {product.district}</span>
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
                  Min. Rental Days - {product.rentalDays} days
                </div>
                <p className="equipment-price">₹{product.price} / day</p>
                <button onClick={() => handleRentNow(product._id)} className="rent-now-button">Rent Now</button>
              </div>
            ))
          ) : (
            <p>No popular products found.</p>
          )}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
};

export default PopularProducts;
