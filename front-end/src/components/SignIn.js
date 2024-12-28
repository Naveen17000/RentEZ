import React, { useState } from 'react';
import '../styles/SignIn.css';
import { signIn } from '../api';

const SignIn = ({ closeModal, openSignUp, onSignInSuccess }) => {
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
  
    try {
      const data = await signIn(email, password);
      setMessage({ text: 'Sign in successful', type: 'success' });
      // Remove the redundant sessionStorage calls
      sessionStorage.setItem('authToken', data.token);
      onSignInSuccess();
      closeModal();
    } catch (error) {
      setMessage({ text: error.response?.data?.error || 'Sign in failed', type: 'error' });
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Sign In</h2>
        {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
        <form onSubmit={handleSignIn}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="continue-btn">Continue</button>
        </form>
        <p className="register-text">
          New User? <button onClick={(e) => { e.preventDefault(); openSignUp(); }} className="link-button">Register</button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
