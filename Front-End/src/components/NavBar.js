import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/NavBar.css';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for user data
    const userToken = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (userToken && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

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

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Clear localStorage regardless of server response
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userLevel');
      
      // Reset user state
      setUser(null);
      
      // Close dropdowns
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
      
      // Redirect to home
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage and redirect even if there's an error
      localStorage.clear();
      setUser(null);
      navigate('/');
    }
  };

  useEffect(() => {
    const closeDropdowns = (e) => {
      if (isProfileDropdownOpen && !e.target.closest('.user-navbar-profile')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', closeDropdowns);
    return () => document.removeEventListener('click', closeDropdowns);
  }, [isProfileDropdownOpen]);

  return (
    <header className={`user-navbar-header ${isScrolled ? 'user-navbar-scrolled' : ''}`}>
      <div className="user-navbar-container">
        <div className="user-navbar-logo">
          <Link to="/">
            <img src="/assets/images/logo.png" alt="petpal+" className="user-navbar-logo-img" />
            <span className="user-navbar-logo-text">PetPal<span className="user-navbar-plus">+</span></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="user-navbar-nav">
          <ul className="user-navbar-links">
            <li className="user-navbar-link-item">
              <Link to="/" className="user-navbar-link">Home</Link>
            </li>
            <li className="user-navbar-link-item">
              <Link to="/appointment-form" className="user-navbar-link">Book Appointment</Link>
            </li>
            <li className="user-navbar-link-item">
              <Link to="/pharmacy" className="user-navbar-link">Pharmacy</Link>
            </li>
            <li className="user-navbar-link-item">
              <Link to="/services" className="user-navbar-link">Services</Link>
            </li>
            <li className="user-navbar-link-item">
              <Link to="/contact" className="user-navbar-link">Contact Us</Link>
            </li>
            <li className="user-navbar-link-item">
              <Link to="/faq" className="user-navbar-link">FAQ</Link>
            </li>
          </ul>
        </nav>

        {/* User Profile Section with Become a Vet Button */}
        <div className="user-navbar-user-section">
          {/* Become a Vet button - visible for all users */}
          <Link to="/apply-vet" className="user-navbar-become-vet-btn">
            Become a Vet
          </Link>
          
          <div className="user-navbar-profile" onClick={(e) => e.stopPropagation()}>
            {user ? (
              <div className="user-navbar-user">
                <div className="user-navbar-profile-icon" onClick={toggleProfileDropdown}>
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.username || 'User'} className="user-navbar-avatar" />
                  ) : (
                    <div className="user-navbar-avatar-placeholder">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                {isProfileDropdownOpen && (
                  <div className="user-navbar-dropdown">
                    <div className="user-navbar-dropdown-header">
                      <span className="user-navbar-greeting">Hello, {user.username || 'User'}!</span>
                      {/* <span className="user-navbar-email">{localStorage.getItem('userEmail')}</span> */}
                    </div>
                    <ul className="user-navbar-dropdown-menu">
                      <li className="user-navbar-dropdown-item">
                        <Link to="/profile" className="user-navbar-dropdown-link" onClick={() => setIsProfileDropdownOpen(false)}>
                          <i className="fas fa-user"></i> My Profile
                        </Link>
                      </li>
                      <li className="user-navbar-dropdown-item">
                        <Link to="/pets" className="user-navbar-dropdown-link" onClick={() => setIsProfileDropdownOpen(false)}>
                          <i className="fas fa-paw"></i> My Pets
                        </Link>
                      </li>
                      <li className="user-navbar-dropdown-item">
                        <Link to="/my-appointments" className="user-navbar-dropdown-link" onClick={() => setIsProfileDropdownOpen(false)}>
                          <i className="fas fa-calendar-check"></i> My Appointments
                        </Link>
                      </li>
                      <li className="user-navbar-dropdown-item">
                        <Link to="/my-orders" className="user-navbar-dropdown-link" onClick={() => setIsProfileDropdownOpen(false)}>
                          <i className="fas fa-shopping-bag"></i> My Orders
                        </Link>
                      </li>
                      <li className="user-navbar-dropdown-divider"></li>
                      <li className="user-navbar-dropdown-item">
                        <button className="user-navbar-logout-btn" onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt"></i> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="user-navbar-auth-buttons">
                <Link to="/login" className="user-navbar-login-btn">Login</Link>
                <Link to="/register" className="user-navbar-signup-btn">Sign Up</Link>
              </div>
            )}
          </div>
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
          <li><Link to="/appointment-form" onClick={toggleMobileMenu}>Book Appointment</Link></li>
          <li><Link to="/pharmacy" onClick={toggleMobileMenu}>Pharmacy</Link></li>
          <li><Link to="/services" onClick={toggleMobileMenu}>Services</Link></li>
          <li><Link to="/contact" onClick={toggleMobileMenu}>Contact Us</Link></li>
          <li><Link to="/faq" onClick={toggleMobileMenu}>FAQ</Link></li>
          {/* Become a Vet button in mobile menu - visible for all users */}
          <li><Link to="/apply-vet" onClick={toggleMobileMenu}>Become a Vet</Link></li>
          {user && (
            <>
              <li className="user-navbar-mobile-divider"></li>
              <li><Link to="/profile" onClick={toggleMobileMenu}>My Profile</Link></li>
              <li><Link to="/pets" onClick={toggleMobileMenu}>My Pets</Link></li>
              <li><Link to="/my-appointments" onClick={toggleMobileMenu}>My Appointments</Link></li>
              <li><Link to="/my-orders" onClick={toggleMobileMenu}>My Orders</Link></li>
              <li><button className="user-navbar-mobile-logout-btn" onClick={handleLogout}>Logout</button></li>
            </>
          )}
          {!user && (
            <>
              <li className="user-navbar-mobile-divider"></li>
              <li><Link to="/login" onClick={toggleMobileMenu}>Login</Link></li>
              <li><Link to="/register" onClick={toggleMobileMenu}>Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default NavBar;