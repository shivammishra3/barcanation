import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const { email } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/change-password/${email}`, {
        email: email,
        password: password,
      });

      // Password change successful
      console.log(response.data.message);
      navigate('/login'); // Redirect to login page
    } catch (error) {
      setErrorMessage('Failed to change password. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="signup-form">
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <button type="submit">Change Password</button>
        </div>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default ChangePassword;
