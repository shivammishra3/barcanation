import React, { useEffect } from 'react';
import { setAuthToken } from './api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './navbar';
import Videos from './videos';
import Login from './login';
import Signup from './signup';
import ForgotPassword from './forgotpassword';
import OTP from './otp';
import YourComponent from './yourcomponent';
import ChangePassword from './changepassword';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);
  }, []);

  const handleOTPVerificationSuccess = () => {
    console.log('OTP verification successful checking in app.js');
    // Additional logic after OTP verification success
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navbar />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp/:email" element={<YourComponent />} />
          {/* <Route path="/verify-otp" element={<OTP onSuccess={handleOTPVerificationSuccess} />} /> */}
          {/* <Route path="/change-password" element={<ChangePassword />} /> */}
          <Route path="/change-password/:email" element={<ChangePassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
