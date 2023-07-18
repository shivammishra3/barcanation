import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter your email');
      return;
    }

    try {
      await axios.post('http://localhost:3000/forgot-password', {
        email: email,
      });

      setMessage('Password reset email sent');
      navigate(`/verify-otp/${email}`);
    } catch (error) {
      setMessage('This email is not registered');
    }
  };

  return (
    <div className="signup-form">
      <h2>Forgot Password</h2>
      <form onSubmit={handleResetPassword}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <button type="submit">Reset Password</button>
        </div>
      </form>
      {message && <p style={{ color: message.includes('not registered') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
