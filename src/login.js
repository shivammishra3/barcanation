import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './login.css';

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
    <section>
      <div className="form-box">
        <div className="form-value">
          <form onSubmit={handleLoginSubmit}>
            <h2>Login</h2>
            <div className="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" required />
              <label htmlFor="email">Email</label>
            </div>
            <div className="inputbox">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <label htmlFor="password">Password</label>
            </div>
            <div className="forget">
              <label htmlFor="password">
              <Link to="/forgot-password">Forgot Password ?</Link>
              </label>
            </div>
            <button type="submit">Login</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <div className="register">
              <p>
                Don't have an account ?<a href="/signup"> Sign Up</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
