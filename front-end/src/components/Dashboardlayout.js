// DashboardLayout.js
import React from 'react';
import SideNav from './SideNav';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';

function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const onLogout = () => {
    sessionStorage.clear(); // Clear session storage to log out
    navigate('/'); // Redirect to home page
    window.location.reload(); // Refresh to immediately reflect logout status
  };


  return (
    <div className="dashboard-container">
      <SideNav onLogout={onLogout} /> {/* Pass onLogout function */}
      <div className="dashboard-main">
        {children} {/* Render page content */}
      </div>
    </div>
  );
}

export default DashboardLayout;
