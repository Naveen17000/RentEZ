// Header.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = ({ isLoggedIn, openSignIn, scrollToFooter, setSearchQuery, searchQuery }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileClick = () => {
    navigate('/dashboard');
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);  // Pass search query to parent component
  };

  return (
    <header className="header">
      <div className="logo"><Link to="/">RentEZ</Link></div>

      {/* Conditionally render the search bar on the /products page */}
      {location.pathname === '/products' && (
        <div className="search-container">
          <div className="search-bar-wrapper">
            <input
              type="text"
              placeholder="Search equipment..."
              className="header-search-bar"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="search-button">
              <div className="search-icon-circle" />
              <span className="search-icon-line" />
            </button>
          </div>
        </div>
      )}

      <nav className="nav-container">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <button onClick={scrollToFooter} className="about-button">About</button>
          <Link to="/products" className="available-eq">Available Equipment</Link>
        </div>
      </nav>

      {isLoggedIn ? (
        <div className="profile-logo" onClick={handleProfileClick}>
          <img src="/assets/profile.png" alt="Profile" className="profile-icon" />
        </div>
      ) : (
        <button onClick={openSignIn} className="sign-in-button">
          Sign In
        </button>
      )}
    </header>
  );
};

export default Header;
