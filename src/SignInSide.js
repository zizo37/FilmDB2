import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const supabase = createClient('https://dzztqaghfzbdepqjpvkn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6enRxYWdoZnpiZGVwcWpwdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNjY1NzMsImV4cCI6MjA1MDc0MjU3M30.4MSnpBef8oe40jbCUzzaP2gtnoI6C42ziWNzos6CFGw');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');


  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error.message);
        setErrorMessage(error.message);
      } else if (data) {
        console.log('Sign in initiated successfully');
        // The redirect will happen automatically
      }
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      setErrorMessage(error.message);
    }
  };

  const handleForgotPassword = async () => {
    navigate('/forgotpassword');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    try {
      const { user, session, error } = await supabase.auth.signInWithPassword({
        email: data.get('email'),
        password: data.get('password'),
      });

      if (error) {
        if (error.message === 'No user found for this email address.') {
          console.error('User not found. Please check your email address.');
          setErrorMessage('User not found. Please check your email address.')
        } else {
          console.error('Error signing in:', error.message);
          setErrorMessage(error.message)
        }
      } else {
        console.log('User signed in successfully:', user);
        console.log('Session details:', session);
        navigate('/');
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      setErrorMessage(error.message)
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <img src="filmdb.png" alt="FilmDB Logo" className="auth-logo" />
        <div className="auth-form-container">
          <button className="auth-google-btn" onClick={handleGoogleSignIn}>
            <img src="Google_logo.png" alt="Google" width="24" />
            Sign in with Google
          </button>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
            <div style={{ textAlign: 'right' }}>
              <a href="/forgotpassword" className="auth-link">
                Forgot password?
              </a>
            </div>
            <button
                type="submit"
                className="auth-btn"
                style={{ padding: '10px 20px' }}
              >
                Sign In
              </button>
            {errorMessage && (
              <div className="auth-error">{errorMessage}</div>
            )}
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            Don't have an account?{' '}
            <a href="/signup" className="auth-link">
              Sign up
            </a>
          </div>
        </div>
      </div>
      <div
        className="auth-image-section"
        style={{ backgroundImage: 'url(moviesbg.jpg)' }}
      >
        <div className="auth-image-overlay" />
      </div>
    </div>
  );
}
export default SignIn;
