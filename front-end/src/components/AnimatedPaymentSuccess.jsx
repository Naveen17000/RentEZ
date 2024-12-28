import React, { useState } from "react";
import "animate.css";

const AnimatedPaymentSuccess = ({ onClose }) => {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      if (onClose) onClose(); // Notify parent to unmount or hide the component
    }, 1000); // Matches the duration of the fadeOut animation
  };

  return (
    <div
      className={`animate__animated ${
        closing ? "animate__fadeOut" : "animate__fadeIn"
      } payment-success-wrapper`}
    >
      <div className="payment-success-content">
        <div className="checkmark-circle">
          <div className="checkmark"></div>
        </div>
        <h1>Payment Successful</h1>
        <p>Thank you! Your payment has been processed successfully.</p>
        <button className="back-home-btn" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AnimatedPaymentSuccess;
