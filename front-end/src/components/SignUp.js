import React, { useState } from 'react';
import '../styles/SignIn.css';
import { signUp } from '../api';

const SignUp = ({ closeModal, openSignIn, onSignUpSuccess }) => {
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSignUp = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const confirmPassword = e.target[3].value;

    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match!', type: 'error' });
      return;
    }

    try {
      const data = await signUp(username, email, password);
      setMessage({ text: 'Registration successful', type: 'success' });
      sessionStorage.setItem('authToken', data.token); // Store token in sessionStorage
      onSignUpSuccess();
      closeModal();
    } catch (error) {
      setMessage({ text: error.response?.data?.error || 'Registration failed', type: 'error' });
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Sign Up</h2>
        {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
        <form onSubmit={handleSignUp}>
          <input type="text" placeholder="Username" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <button type="submit" className="continue-btn">Continue</button>
        </form>
        <p className="login-text">
          Already registered? <button onClick={(e) => { e.preventDefault(); openSignIn(); }} className="link-button">Login</button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
