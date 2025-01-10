import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RelatedProducts.css";
import { fetchRelatedProducts } from "../api"; // Import the API function to fetch related products

const RelatedProducts = ({ productId }) => {
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        const data = await fetchRelatedProducts(productId); // Fetch related products from the backend
        setRelatedProducts(data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    loadRelatedProducts();
  }, [productId]);

  const handleRentNow = (id) => {
    navigate(`/equipment/${id}`);
    window.scrollTo(0, 0); // Scroll to top when a related product is clicked
  };

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [id]: !prevFavorites[id],
    }));
  };

  return (
    <div className="related-products">
      <main className="content">
        <div className="equipmentt-grid">
          {relatedProducts.map((item) => (
            <div className="equipmentt-card" key={item._id}>
              <div className="heart-border">
                <div
                  className={`favorite-icon ${favorites[item._id] ? "active" : ""}`}
                  onClick={() => toggleFavorite(item._id)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={favorites[item._id] ? "#FF0000" : "none"}
                    stroke={favorites[item._id] ? "none" : "#000000"}
                    strokeWidth="1.5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </div>
              <h4>{item.name}</h4>
              <p className="equipmentt-type">{item.category}</p>
              <img src={`https://rentez-2quq.onrender.com/${item.images[0].replace(/\\/g, '/')}`} alt={item.name} className="equipment-image" />
              <div className="equipmentt-location">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>{item.location},  {item.district}</span>
              </div>
              <div className="equipmentt-rentaldays">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                </svg>
                <span>Min Rental Days: {item.rentalDays}</span>
              </div>
              <p className="equipmentt-price">₹{item.price} / day</p>
              <button onClick={() => handleRentNow(item._id)} className="rentt-now-button">
                Rent Now
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RelatedProducts;
