import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './signup.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!email && !password) {
      setErrorMessage('Please enter your credentials!');
      return;
    } else if (!email) {
      setErrorMessage('Please enter your email');
      return;
    } else if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email: email,
        password: password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);

      // Handle the response from the server or redirect to another page in future
      console.log(response.data);
    } catch (error) {
      setErrorMessage('Wrong password or email, Please try again!');
      console.error(error);
    }

    console.log('Login form submitted');
  };

  return (
    <div className="signup-form">
      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <button type="submit">Login</button>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div>
        <p>Don't have an account?</p>
        <button><Link to="/signup">Sign Up</Link></button>
      </div>
    </div>
  );
};

export default Login;
