import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css';

function SignUp() {
  const supabase = createClient('https://dzztqaghfzbdepqjpvkn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6enRxYWdoZnpiZGVwcWpwdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNjY1NzMsImV4cCI6MjA1MDc0MjU3M30.4MSnpBef8oe40jbCUzzaP2gtnoI6C42ziWNzos6CFGw');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password should be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: `${firstName}.${lastName}`
          }
        }
      });

      if (error) throw error;
      navigate('/signin');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div
        className="auth-image-section"
        style={{ backgroundImage: 'url(moviesbg.jpg)' }}
      >
        <div className="auth-image-overlay" />
      </div>
      <div className="auth-content">
        <img src="filmdb.png" alt="FilmDB Logo" className="auth-logo" />
        <div className="auth-form-container">
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              required
              className="auth-input"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              required
              className="auth-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              className="auth-input"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="auth-input"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              className="auth-input"
            />
            <button type="submit" className="auth-btn">
              Sign Up
            </button>
            {errorMessage && (
              <div className="auth-error">{errorMessage}</div>
            )}
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            Already have an account?{' '}
            <a href="/signin" className="auth-link">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;