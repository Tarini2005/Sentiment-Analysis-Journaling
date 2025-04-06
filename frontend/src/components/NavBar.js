import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Get current path
  const getCurrentPath = () => {
    return location.pathname;
  };
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">MoodJournal</Link>
        
        <button className="mobile-menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon">☰</span>
        </button>
      </div>
      
      <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
        <Link 
          to="/" 
          className={`navbar-item ${getCurrentPath() === '/' ? 'active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Dashboard
        </Link>
        <Link 
          to="/journal" 
          className={`navbar-item ${getCurrentPath() === '/journal' ? 'active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Journal
        </Link>
        <Link 
          to="/settings" 
          className={`navbar-item ${getCurrentPath() === '/settings' ? 'active' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          Settings
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
