import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import MyProducts from './pages/MyProducts';
import MyOrders from './pages/MyOrders';
import SavedAddresses from './pages/saveaddress';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import DashboardLayout from './components/Dashboardlayout'
import RentNow from './components/RentNow';
import Favorite from './pages/MyFavorites';
import Orderstatus from './pages/Orderstatus'
import PersonalDetails from './pages/Personaldetails';

const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

const App = ({ navigate }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('authToken'));
  const [searchQuery, setSearchQuery] = useState("");

  const footerRef = useRef(null);

  useEffect(() => {
    // Check if token exists in sessionStorage to set initial login state
    setIsLoggedIn(!!sessionStorage.getItem('authToken'));
  }, []);

  const openSignIn = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const openSignUp = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };

  const closeModal = () => {
    setShowSignIn(false);
    setShowSignUp(false);
  };

  const handleSignInSuccess = () => {
    setIsLoggedIn(true);
    closeModal();
  };

  const handleSignUpSuccess = () => {
    setIsLoggedIn(true);
    closeModal();
    navigate('/dashboard/personal-details'); // Navigate to personal details page after sign-up
  };

  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      <Header
        isLoggedIn={isLoggedIn}
        openSignIn={openSignIn}
        scrollToFooter={scrollToFooter}
        setSearchQuery={setSearchQuery} // Pass setSearchQuery here
        searchQuery={searchQuery}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products searchQuery={searchQuery} />} />
        <Route path="/equipment/:id" element={<RentNow />} />
        {/* Protect Dashboard and MyProducts routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Dashboard />
          </ProtectedRoute>
        }
        />
        <Route path="/dashboard/personal-details" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <PersonalDetails />
          </ProtectedRoute>
        }
        />
        <Route
          path="/dashboard/my-address"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <DashboardLayout>
                <SavedAddresses />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/my-products"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path='/dashboard/favorites'
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Favorite />
            </ProtectedRoute>
          }
        />
        <Route
          path='/dashboard/my-orders'
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/dashboard/order-status'
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Orderstatus />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer ref={footerRef} />
      {showSignIn && <SignIn closeModal={closeModal} openSignUp={openSignUp} onSignInSuccess={handleSignInSuccess} />}
      {showSignUp && <SignUp closeModal={closeModal} openSignIn={openSignIn} onSignUpSuccess={handleSignUpSuccess} />}
    </div>
  );
};

const AppWithRouter = () => {
  const navigate = useNavigate();
  return <App navigate={navigate} />;
};

const AppWrapper = () => (
  <Router>
    <AppWithRouter />
  </Router>
);

export default AppWrapper;
