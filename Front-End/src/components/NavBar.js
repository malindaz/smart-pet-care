// NavBar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';

const NavBar = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  useEffect(() => {
    const closeDropdowns = () => {
      if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
    };

    document.addEventListener('click', closeDropdowns);
    return () => document.removeEventListener('click', closeDropdowns);
  }, [isProfileDropdownOpen]);

  return (
    <header className={`user-navbar-header ${isScrolled ? 'user-navbar-scrolled' : ''}`}>
      <div className="user-navbar-container">
        <div className="user-navbar-logo">
          <Link to="/">
            <img src="/logo.png" alt="PetCare+" className="user-navbar-logo-img" />
            <span className="user-navbar-logo-text">PetCare<span className="user-navbar-plus">+</span></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="user-navbar-nav">
          <ul className="user-navbar-links">
            <li className="user-navbar-link-item">
              <Link to="/" className="user-navbar-link">Home</Link>
            </li>
            <li className="user-navbar-link-item">
              <Link to="/appointments" className="user-navbar-link">Book Appointment</Link>
            </li>
            <li className="user-navbar-link-item">
              <Link to="/pharmacy" className="user-navbar-link">Pharmacy</Link>
            </li>
            <li className="user-navbar-link-item">
              <Link to="/Profile" className="user-navbar-link">Services</Link>
            </li>
            <li className="user-navbar-link-item">
              <Link to="/contact" className="user-navbar-link">Contact Us</Link>
            </li>
            <li className="user-navbar-link-item">
              <Link to="/faq" className="user-navbar-link">FAQ</Link>
            </li>
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="user-navbar-profile" onClick={(e) => e.stopPropagation()}>
          {user ? (
            <div className="user-navbar-user">
              <div className="user-navbar-profile-icon" onClick={toggleProfileDropdown}>
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="user-navbar-avatar" />
                ) : (
                  <div className="user-navbar-avatar-placeholder">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {isProfileDropdownOpen && (
                <div className="user-navbar-dropdown">
                  <div className="user-navbar-dropdown-header">
                    <span className="user-navbar-greeting">Hello, {user.name}!</span>
                  </div>
                  <ul className="user-navbar-dropdown-menu">
                    <li className="user-navbar-dropdown-item">
                      <Link to="/Profile" className="user-navbar-dropdown-link">
                        <i className="fas fa-user"></i> My Profile
                      </Link>
                    </li>
                    <li className="user-navbar-dropdown-item">
                      <Link to="/pets" className="user-navbar-dropdown-link">
                        <i className="fas fa-paw"></i> My Pets
                      </Link>
                    </li>
                    <li className="user-navbar-dropdown-item">
                      <Link to="/my-appointments" className="user-navbar-dropdown-link">
                        <i className="fas fa-calendar-check"></i> My Appointments
                      </Link>
                    </li>
                    <li className="user-navbar-dropdown-divider"></li>
                    <li className="user-navbar-dropdown-item">
                      <button className="user-navbar-logout-btn">
                        <i className="fas fa-sign-out-alt"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="user-navbar-auth-buttons">
              <Link to="/Login" className="user-navbar-login-btn">Login</Link>
              <Link to="/Register" className="user-navbar-signup-btn">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="user-navbar-mobile-toggle" onClick={toggleMobileMenu}>
          <div className={`user-navbar-hamburger ${isMobileMenuOpen ? 'user-navbar-active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`user-navbar-mobile-menu ${isMobileMenuOpen ? 'user-navbar-open' : ''}`}>
        <ul className="user-navbar-mobile-links">
          <li><Link to="/" onClick={toggleMobileMenu}>Home</Link></li>
          <li><Link to="/appointments" onClick={toggleMobileMenu}>Book Appointment</Link></li>
          <li><Link to="/pharmacy" onClick={toggleMobileMenu}>Pharmacy</Link></li>
          <li><Link to="/services" onClick={toggleMobileMenu}>Services</Link></li>
          <li><Link to="/contact" onClick={toggleMobileMenu}>Contact Us</Link></li>
          <li><Link to="/faq" onClick={toggleMobileMenu}>FAQ</Link></li>
          {user && (
            <>
              <li className="user-navbar-mobile-divider"></li>
              <li><Link to="/Profile" onClick={toggleMobileMenu}>My Profile</Link></li>
              <li><Link to="/pets" onClick={toggleMobileMenu}>My Pets</Link></li>
              <li><Link to="/my-appointments" onClick={toggleMobileMenu}>My Appointments</Link></li>
              <li><button className="user-navbar-mobile-logout-btn">Logout</button></li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default NavBar;