// SideNav.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/SideNav.css';

function SideNav({ onLogout }) {
  const location = useLocation();
  const navItems = [
    { label: "Dashboard", icon: "/assets/icons/dashboard.svg", path: "/dashboard" },
    { label: "Bank Details", icon: "/assets/icons/personal-details.svg", path: "/dashboard/personal-details" },
    { label: "Saved Address", icon: "/assets/icons/saved-address.svg", path: "/dashboard/my-address" },
    { label: "My Products", icon: "/assets/icons/products.svg", path: "/dashboard/my-products" },
    { label: "My Orders", icon: "/assets/icons/orders.svg", path: "/dashboard/my-orders" },
    { label: "Favorites", icon: "/assets/icons/favorites.svg", path: "/dashboard/favorites" },
    { label: "Order Status", icon: "/assets/icons/status.svg", path: "/dashboard/order-status" }
  ];

  // Determine the active item based on the current location
  const getActiveItem = () => {
    const currentPath = location.pathname;
    const activeNavItem = navItems.find(item => item.path === currentPath);
    return activeNavItem ? activeNavItem.label : "Dashboard"; // Default to "Dashboard" if no match
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  const handleItemClick = (label) => {
    setActiveItem(label);
  };

  return (
    <div className="side-nav">
      {navItems.map((item, index) => (
        <Link
          to={item.path}
          key={index}
          className={`nav-item ${activeItem === item.label ? 'active' : ''}`}
          onClick={() => handleItemClick(item.label)}
        >
          <img src={item.icon} alt={item.label} className="icon" />
          <span className="label">{item.label}</span>
        </Link>
      ))}
      <div className="logout" onClick={onLogout}>
        <img src="/assets/icons/logout.svg" alt="Log Out" className="icon" />
        <span className="label">Log Out</span>
      </div>
    </div>
  );
}

export default SideNav;