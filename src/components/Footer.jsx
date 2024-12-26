// src/components/Footer.jsx
import React from "react";
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <p>&copy; 2024 Apotek Spotter. All rights reserved.</p>
        </div>
        <div className="footer-right">
          <ul className="social-links">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
