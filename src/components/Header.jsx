import React from "react";
import { Link } from "react-router-dom"; 
import './Header.css'; 
import logo from '../assets/images/logo.png'; 

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          
          <img src={logo} alt="Logo Apotek Spotter" className="logo" />
          <h1 className="logo-text">Apotek Spotter</h1>
        </div>
        
        <nav className="nav-links">
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-item">Home</Link>
            </li>
            <li>
              <Link to="/about" className="nav-item">About</Link>
            </li>
            <li>
              <Link to="/admin" className="nav-item">Admin</Link> 
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
