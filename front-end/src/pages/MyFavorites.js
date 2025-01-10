import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from '../components/Dashboardlayout';
import { getAllFavorites, updateFavorite } from '../api';
import '../styles/MyFavorites.css';

const Favorites = () => {
  const [equipmentData, setEquipmentData] = useState([]); 
  const [favorites, setFavorites] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const data = await getAllFavorites();
        
        // Validate the response data
        if (!data) {
          throw new Error('No data received from server');
        }

        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [];
        
        // Filter out invalid items and create favorites map
        const validEquipment = dataArray.filter(item => 
          item && 
          typeof item === 'object' && 
          item._id && 
          item.name && 
          item.category
        );

        const favoritesMap = validEquipment.reduce((acc, item) => {
          acc[item._id] = true;
          return acc;
        }, {});

        setEquipmentData(validEquipment);
        setFavorites(favoritesMap);
        setError(null);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError('Failed to load favorites. Please try again later.');
        setEquipmentData([]);
        setFavorites({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (id) => {
    if (!id) return;
    
    const isFavorite = !favorites[id];

    try {
      await updateFavorite(id, isFavorite);
      setFavorites(prevFavorites => ({
        ...prevFavorites,
        [id]: isFavorite,
      }));

      if (!isFavorite) {
        setTimeout(() => {
          setEquipmentData(prevData => prevData.filter(item => item._id !== id));
        }, 5000);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  const handleRentNow = (id) => {
    if (id) {
      navigate(`/equipment/${id}`);
    }
  };

  return (
    <DashboardLayout>
      <main className="content">
        <h1>My Favorites</h1>
        
        {isLoading && <div>Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        
        {!isLoading && !error && (
          <div className="equipment-grid">
            {equipmentData.length === 0 ? (
              <div>No favorites found</div>
            ) : (
              equipmentData.map((item) => (
                item && item._id ? (
                  <div className="equipment-card" key={item._id}>
                    <div className="heart-border">
                      <div
                        className={`favorite-icon-new ${favorites[item._id] ? 'active' : ''}`}
                        onClick={() => toggleFavorite(item._id)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill={favorites[item._id] ? "#FF0000" : "#FFFFFF"}
                          stroke={favorites[item._id] ? "none" : "#000000"}
                          strokeWidth="1.5"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                    </div>
                    <h4>{item.name || 'Unnamed Equipment'}</h4>
                    <p className="equipment-type">
                      {item.category || 'Uncategorized'} 
                      {item.subCategory ? ` - ${item.subCategory}` : ''}
                    </p>

                    {item.images && item.images.length > 0 ? (
                      <img
                        src={`https://rentez-2quq.onrender.com/${item.images[0].replace(/\\/g, '/')}`}
                        alt={item.name}
                        className="equipment-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'placeholder-image-url';
                        }}
                      />
                    ) : (
                      <p>No image available</p>
                    )}

                    <div className="equipment-location">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span>
                        {item.location || 'Location unavailable'}
                        {item.district ? `, ${item.district}` : ''}
                      </span>
                    </div>
                    
                    <div className="equipment-rentaldays">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                      </svg>
                      {item.rentalDays ? `${item.rentalDays} days` : 'Rental period not specified'}
                    </div>
                    
                    <p className="equipment-price">
                      {item.price ? `₹${item.price} / day` : 'Price not available'}
                    </p>
                    
                    <button 
                      onClick={() => handleRentNow(item._id)} 
                      className="rent-now-button"
                    >
                      Rent Now
                    </button>
                  </div>
                ) : null
              ))
            )}
          </div>
        )}
      </main>
    </DashboardLayout>
  );
};

export default Favorites;