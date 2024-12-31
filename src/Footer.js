import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <Link to="/" className="footer-logo">
            <img src="filmdb.png" alt="FilmDB Logo" className="footer-logo-img" />
          </Link>
          <p className="footer-description">
            Your ultimate destination for movies and TV shows. Discover, track, and enjoy your favorite entertainment.
          </p>
        </div>

        <div className="footer-links-container">
          <div className="footer-links-section">
            <h3 className="footer-title">Navigation</h3>
            <Link to="/popular">Popular</Link>
            <Link to="/toprated">Top Rated</Link>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/signin">Sign In</Link>
          </div>

          <div className="footer-links-section">
            <h3 className="footer-title">Legal</h3>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            {/* <Link to="/cookies">Cookie Policy</Link>
            <Link to="/gdpr">GDPR</Link> */}
          </div>

          <div className="footer-links-section">
            <h3 className="footer-title">Connect</h3>
            <div className="footer-social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">© {currentYear} FilmDB. All rights reserved.</p>
          <div className="powered-by">
            Powered by <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">TMDB API</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;