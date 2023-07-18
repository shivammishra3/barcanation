import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OTP = ({ email, onSuccess }) => {
  const [otp, setOTP] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    console.log('Email:', email);
    console.log('OTP:', otp);
    console.log('Request body:', { email, otp });

    try {
      const response = await axios.post(`http://localhost:3000/verify-otp/${email}`, {
        email: email,
        otp: otp,
      });

      if (response.status === 200) {
        // OTP verification successful
        console.log('OTP verification successful');
        onSuccess();
        navigate(`/change-password/${email}`);
      } else {
        setErrorMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Failed to verify OTP. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="signup-form">
      <h2>OTP Verification</h2>
      <form onSubmit={handleVerifyOTP}>
        <div>
          <label htmlFor="otp">Enter OTP:</label>
          <input type="text" id="otp" name="otp" value={otp} onChange={(e) => setOTP(e.target.value)} autoComplete="off" />
        </div>
        <div>
          <button type="submit">Verify OTP</button>
        </div>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default OTP;
