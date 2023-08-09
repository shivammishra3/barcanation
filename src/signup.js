import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './signup.css';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    if (signupSuccess) {
      // Redirect to login page after 2 seconds
      const redirectTimer = setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [signupSuccess]);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    // Perform validation for first name, last name, password, and email
    let errorExists = false;

    if (firstName.trim().length === 0) {
      setFirstNameError('Please enter your First Name');
      errorExists = true;
    } else if (firstName.length < 2) {
      setFirstNameError('First name should have at least 2 characters');
      errorExists = true;
    } else {
      setFirstNameError('');
    }

    if (lastName.trim().length === 0) {
      setLastNameError('Please enter your Last Name');
      errorExists = true;
    } else if (lastName.length < 2) {
      setLastNameError('Last name should have at least 2 characters');
      errorExists = true;
    } else {
      setLastNameError('');
    }

    if (email.trim().length === 0) {
      setEmailError('Please enter your Email');
      errorExists = true;
    } else {
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(email)) {
        setEmailError('This is an invalid email format!');
        errorExists = true;
      } else {
        setEmailError('');
      }
    }

    if (password.trim().length === 0) {
      setPasswordError('Please enter your Password');
      errorExists = true;
    } else if (password.length < 4) {
      setPasswordError('Password should have at least 4 characters');
      errorExists = true;
    } else {
      setPasswordError('');
    }

    if (errorExists) {
      return;
    }

    try {
      await axios.post('http://localhost:3000/signup', {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });

      setSignupSuccess(true);
      console.log('Signup Successful!');
    } catch (error) {
      console.error(error);
    }

    console.log('Sign-up form submitted');
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    if (e.target.value.trim().length === 0) {
      setFirstNameError('Please enter your First Name');
    } else if (e.target.value.trim().length < 2) {
      setFirstNameError('First name should have at least 2 characters');
    } else {
      setFirstNameError('');
    }
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    if (e.target.value.trim().length === 0) {
      setLastNameError('Please enter your Last Name');
    } else if (e.target.value.trim().length < 2) {
      setLastNameError('Last name should have at least 2 characters');
    } else {
      setLastNameError('');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value.trim().length === 0) {
      setEmailError('Please enter your Email');
    } else if (e.target.value.trim().length < 2) {
      setEmailError('This is an invalid email format!');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.trim().length === 0) {
      setPasswordError('Please enter your Password');
    } else if (e.target.value.trim().length < 4) {
      setPasswordError('Password should have at least 4 characters');
    } else {
      setPasswordError('');
    }
  };
  
  return (
    <section>
      <div className="form-box">
        <div className="form-value">
          <form onSubmit={handleSignupSubmit}>
            <h2>Sign up</h2>

            <div className="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input type="text" value={firstName} onChange={handleFirstNameChange} required/>
              <label htmlFor="text">First Name</label>
              {firstNameError && <span className="error">{firstNameError}</span>}
            </div>
            
            <div className="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input type="text" value={lastName} onChange={handleLastNameChange} required/>
              <label htmlFor="email">Last Name</label>
              {lastNameError && <span className="error">{lastNameError}</span>}
            </div>

            <div className="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input type="email" value={email} onChange={handleEmailChange} required/>
              <label htmlFor="email">Email</label>
              {emailError && <span className="error">{emailError}</span>}
            </div>

            <div className="inputbox">
              <ion-icon name="lock-closed-outline"></ion-icon>
              <input type="password" value={password} onChange={handlePasswordChange} required/>
              <label htmlFor="password">Password</label>
              {passwordError && <span className="error">{passwordError}</span>}
            </div>

            <button type="submit">Sign Up</button>
            {signupSuccess && <p className="success">Signup successful</p>}
            <div className="register">
              <p>
                Already having an account ?<a href="/login"> Login</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
