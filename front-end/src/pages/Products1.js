import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EquipmentPage.css";
import "../api";
import { updateFavorite, getAllFavorites } from "../api";

const equipmentData = [
  { id: 1, name: "Concrete Hammer", type: "Driller", location: "Coimbatore, TN", rentaldays: "Minimum Rental Days : 10", price: 300, image: '/home-slide4.jpg' },
  { id: 2, name: "Forklift Electric Stacker", type: "Driller", location: "Coimbatore, TN", rentaldays: "Minimum Rental Days : 10", price: 500, image: '/home-slide4.jpg' },
  { id: 3, name: "Voltas Electric Forklift", type: "Driller", location: "Coimbatore, TN", rentaldays: "Minimum Rental Days : 10", price: 300, image: '/home-slide4.jpg' },
  { id: 4, name: "Concrete Mixer", type: "Driller", location: "Chennai, TN", rentaldays: "Minimum Rental Days : 10", price: 400, image: '/home-slide4.jpg' },
  { id: 5, name: "Circular Saw", type: "Driller", location: "Bangalore, KA", rentaldays: "Minimum Rental Days : 10", price: 350, image: '/home-slide4.jpg' },
  { id: 6, name: "Electric Drill", type: "Driller", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
  { id: 7, name: "Electric Drill", type: "Driller", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
  { id: 8, name: "Electric Drill", type: "Driller", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
  { id: 9, name: "Electric Drill", type: "Driller", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
  { id: 10, name: "Electric Drill", type: "Mixer", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
  { id: 11, name: "Electric Drill", type: "Mixer", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
  { id: 12, name: "Electric Drill", type: "Mixer", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
  { id: 13, name: "Electric Drill", type: "Mixer", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
  { id: 14, name: "Electric Drill", type: "Mixer", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
  { id: 15, name: "Electric Drill", type: "Mixer", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
  { id: 16, name: "Electric Drill", type: "Mixer", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
  { id: 17, name: "Electric Drill", type: "Mixer", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
  { id: 18, name: "Electric Drill", type: "Mixer", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
  { id: 19, name: "Electric Drill", type: "Mixer", location: "Mumbai, MH", rentaldays: "Minimum Rental Days : 10", price: 250, image: '/home-slide4.jpg' },
];


const EquipmentPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState({});
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [rentalDaysFilter, setRentalDaysFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const isLoggedIn = !!sessionStorage.getItem('authToken');

  // Load favorites when component mounts
  useEffect(() => {
    const loadUserFavorites = async () => {
      if (!isLoggedIn) return;
      
      setLoading(true);
      setError(null); // Reset error state when starting new request
      
      try {
        const userFavorites = await getAllFavorites();
        const favoritesObject = Array.isArray(userFavorites)
          ? userFavorites.reduce((acc, fav) => ({
              ...acc,
              [fav.equipmentId]: true
            }), {})
          : {};
        setFavorites(favoritesObject);
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError('Failed to load favorites. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadUserFavorites();
  }, [isLoggedIn]);

  const handleRentNow = (id) => {
    navigate(`/equipment/${id}`);
  };

  const filteredEquipmentData = equipmentData.filter((item) => {
    const matchesLocation = locationFilter
      ? item.location.toLowerCase().trim().includes(locationFilter.toLowerCase().trim())
      : true;
    const matchesCategory = categoryFilter
      ? item.type.toLowerCase().includes(categoryFilter.toLowerCase())
      : true;
    const matchesRentalDays = rentalDaysFilter
      ? parseInt(item.rentaldays.match(/\d+/)) >= rentalDaysFilter
      : true;
    const matchesPrice = item.price <= priceFilter;
    
    return matchesLocation && matchesCategory && matchesRentalDays && matchesPrice;
  });  

  const toggleFavorite = async (id) => {
    if (!isLoggedIn) {
      if (window.confirm('Please sign in to add items to favorites. Would you like to sign in now?')) {
        navigate('/');
      }
      return;
    }

    try {
      const newFavoriteStatus = !favorites[id];
      
      // Optimistically update UI
      setFavorites(prev => ({
        ...prev,
        [id]: newFavoriteStatus
      }));

      // Make API call
      await updateFavorite(id, newFavoriteStatus);
      
    } catch (err) {
      // Revert UI change if API call fails
      setFavorites(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
      console.error('Error updating favorite:', err);
      alert('Failed to update favorite. Please try again.');
    }
  };

  return (
    <div className="equipment-page">
      <aside className="sidebar">
        <h3>Filter</h3>
        <div className="filter-option">Location</div>
        <input 
          type="text" 
          placeholder="Location" 
          value={locationFilter} 
          onChange={(e) => setLocationFilter(e.target.value)} 
        />
        
        <div className="filter-option">Category</div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Driller">Driller</option>
          <option value="Mixer">Mixer</option>
          {/* Add other categories as needed */}
        </select>
        
        <div className="filter-option">Minimum Rental Days</div>
        <input 
          type="number" 
          placeholder="Enter Days" 
          value={rentalDaysFilter} 
          onChange={(e) => setRentalDaysFilter(e.target.value)} 
        />
        
        <div className="filter-option">Price</div>
        <input 
          type="range" 
          min="0" 
          max="1000" 
          value={priceFilter} 
          onChange={(e) => setPriceFilter(e.target.value)} 
        />
        <div>Max: ₹{priceFilter}</div>
      </aside>

      <main className="content">
        <div className="equipment-grid">
          {filteredEquipmentData.map((item) => (
            <div className="equipment-card" key={item.id}>
              <div className="heart-border">
                <div
                  className={`favorite-icon ${favorites[item.id] ? "active" : ""}`}
                  onClick={() => toggleFavorite(item.id)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={favorites[item.id] ? "#FF0000" : "#FFFFFF"}
                    stroke={favorites[item.id] ? "none" : "#000000"}
                    strokeWidth="1.5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
              <h4>{item.name}</h4>
              <p className="equipment-type">{item.type}</p>
              <img src={item.image} alt={item.name} className="equipment-image" />
              <div className="equipment-location">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>{item.location}</span>
              </div>
              <div className="equipment-rentaldays">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                </svg>
                {item.rentaldays}
              </div>
              <p className="equipment-price">₹{item.price} / day</p>
              <button onClick={() => handleRentNow(item.id)} className="rent-now-button">Rent Now</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EquipmentPage;
