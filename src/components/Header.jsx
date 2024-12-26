// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom"; // Mengimpor Link untuk navigasi antar halaman
import './Header.css'; // Pastikan sudah mengimpor CSS yang relevan

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <h1 className="logo">Apotek Spotter</h1>
        </div>
        <nav className="nav-links">
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-item">Home</Link>
            </li>
            <li>
              <Link to="/about" className="nav-item">About</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
