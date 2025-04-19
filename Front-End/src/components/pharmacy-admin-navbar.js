import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, UserPlus, Calendar, ShoppingBag, Award, Bell } from 'lucide-react';
import '../css/NavBar.css';
import Logo from '../assets/images/Logo.png';

const PmcyAdminNavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

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

    // Mock cart item count - replace with actual cart logic
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const cart = JSON.parse(storedCart);
        setCartItemCount(cart.length || 0);
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }

    // Mock notifications - replace with actual notification logic
    setNotifications([
      { id: 1, text: 'Your appointment has been confirmed', read: false, time: '2 hours ago' },
      { id: 2, text: 'Your order #12345 has been shipped', read: false, time: '1 day ago' },
      { id: 3, text: 'Welcome to PetWellHub!', read: true, time: '3 days ago' }
    ]);
    setUnreadNotifications(2); // Number of unread notifications
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
    if (isNotificationDropdownOpen) setIsNotificationDropdownOpen(false);
  };

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (isNotificationDropdownOpen) setIsNotificationDropdownOpen(false);
  };

  const toggleNotificationDropdown = (e) => {
    e.stopPropagation();
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    setUnreadNotifications(0);
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
      setIsNotificationDropdownOpen(false);

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
      if (isNotificationDropdownOpen && !e.target.closest('.user-navbar-notification')) {
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('click', closeDropdowns);
    return () => document.removeEventListener('click', closeDropdowns);
  }, [isProfileDropdownOpen, isNotificationDropdownOpen]);

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`user-navbar-header ${isScrolled ? 'user-navbar-scrolled' : ''}`}>
      <div className="user-navbar-container">
        <div className="user-navbar-logo">
          <Link to="/">
            <img src={Logo} alt="Petwellhub" className="user-navbar-logo-img" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="user-navbar-nav">
          <ul className="user-navbar-links">
            <li className="user-navbar-link-item">
              <Link to="/" className={`user-navbar-link ${isActive('/') ? 'user-navbar-active' : ''}`}>Home</Link>
            </li>
            <li className="user-navbar-link-item">
              <Link to="/pharmacy" className={`user-navbar-link ${isActive('/pharmacy') ? 'user-navbar-active' : ''}`}>Pharmacy</Link>
            </li>
            <li className="user-navbar-link-item">
              <Link to="/pharmacyAdmin" className={`user-navbar-link ${isActive('/pharmacyAdmin') ? 'user-navbar-active' : ''}`}>Manage Products</Link>
            </li>
            <li className="user-navbar-link-item">
              <Link to="/pharmacy-edit" className={`user-navbar-link ${isActive('/pharmacy-edit') ? 'user-navbar-active' : ''}`}>Add New Products</Link>
            </li>
          </ul>
        </nav>

        {/* User Section with Cart, Notifications and Profile */}
        <div className="user-navbar-user-section">

          <div className="user-navbar-profile" onClick={(e) => e.stopPropagation()}>
            {user ? (
              <div className="user-navbar-user">
                <div className="user-navbar-profile-icon" onClick={toggleProfileDropdown}>
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.username || 'User'} className="user-navbar-avatar" />
                  ) : (
                    <div className="user-navbar-avatar-placeholder">
                      <User size={20} />
                    </div>
                  )}
                </div>
                {isProfileDropdownOpen && (
                  <div className="user-navbar-dropdown">
                    <div className="user-navbar-dropdown-header">
                      <span className="user-navbar-greeting">Hello, {user.username || 'User'}!</span>
                    </div>
                    <ul className="user-navbar-dropdown-menu">
                      <li className="user-navbar-dropdown-item">
                        <Link to="/profile" className="user-navbar-dropdown-link" onClick={() => setIsProfileDropdownOpen(false)}>
                          <User size={16} /> My Profile
                        </Link>
                      </li>
                      <li className="user-navbar-dropdown-divider"></li>
                      <li className="user-navbar-dropdown-item">
                        <button className="user-navbar-logout-btn" onClick={handleLogout}>
                          <LogOut size={16} /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="user-navbar-auth-buttons">
                <Link to="/login" className={`user-navbar-login-btn ${isActive('/login') ? 'user-navbar-active-btn' : ''}`}>Login</Link>
                <Link to="/register" className={`user-navbar-signup-btn ${isActive('/register') ? 'user-navbar-active-btn' : ''}`}>
                  <UserPlus size={16} className="user-navbar-signup-icon" />
                  <span>Sign Up</span>
                </Link>
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
          <li>
            <Link
              to="/"
              className={isActive('/') ? 'user-navbar-mobile-active' : ''}
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/appointment-form"
              className={isActive('/appointment-form') ? 'user-navbar-mobile-active' : ''}
              onClick={toggleMobileMenu}
            >
              Book Appointment
            </Link>
          </li>
          <li>
            <Link
              to="/pharmacy"
              className={isActive('/pharmacy') ? 'user-navbar-mobile-active' : ''}
              onClick={toggleMobileMenu}
            >
              Pharmacy
            </Link>
          </li>
          <li>
            <Link
              to="/apply-vet"
              className={isActive('/apply-vet') ? 'user-navbar-mobile-active' : ''}
              onClick={toggleMobileMenu}
            >
              Apply as Vet
            </Link>
          </li>
          <li>
            <Link
              to="/faq"
              className={isActive('/faq') ? 'user-navbar-mobile-active' : ''}
              onClick={toggleMobileMenu}
            >
              FAQ
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              className={isActive('/cart') ? 'user-navbar-mobile-active' : ''}
              onClick={toggleMobileMenu}
            >
              <ShoppingCart size={16} /> Cart
              {cartItemCount > 0 && <span className="user-navbar-mobile-cart-badge">{cartItemCount}</span>}
            </Link>
          </li>
          {user && (
            <li>
              <Link
                to="/notifications"
                className={isActive('/usernotifications') ? 'user-navbar-mobile-active' : ''}
                onClick={toggleMobileMenu}
              >
                <Bell size={16} /> Notifications
                {unreadNotifications > 0 && <span className="user-navbar-mobile-notification-badge">{unreadNotifications}</span>}
              </Link>
            </li>
          )}
          {user && (
            <>
              <li className="user-navbar-mobile-divider"></li>

              <li>
                <Link
                  to="/profile"
                  className={isActive('/profile') ? 'user-navbar-mobile-active' : ''}
                  onClick={toggleMobileMenu}
                >
                  <User size={16} /> My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/pets"
                  className={isActive('/pets') ? 'user-navbar-mobile-active' : ''}
                  onClick={toggleMobileMenu}
                >
                  <Award size={16} /> My Pets
                </Link>
              </li>
              <li>
                <Link
                  to="/my-appointments"
                  className={isActive('/myappointments') ? 'user-navbar-mobile-active' : ''}
                  onClick={toggleMobileMenu}
                >
                  <Calendar size={16} /> My Appointments
                </Link>
              </li>
              <li>
                <Link
                  to="/my-orders"
                  className={isActive('/my-orders') ? 'user-navbar-mobile-active' : ''}
                  onClick={toggleMobileMenu}
                >
                  <ShoppingBag size={16} /> My Orders
                </Link>
              </li>
              <li>
                <button className="user-navbar-mobile-logout-btn" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </li>

              <li><Link to="/profile" onClick={toggleMobileMenu}>My Profile</Link></li>
              <li><Link to="/mypets" onClick={toggleMobileMenu}>My Pets</Link></li>
              <li><Link to="/my-appointments" onClick={toggleMobileMenu}>My Appointments</Link></li>
              <li><Link to="/my-orders" onClick={toggleMobileMenu}>My Orders</Link></li>
              <li><button className="user-navbar-mobile-logout-btn" onClick={handleLogout}>Logout</button></li>

            </>
          )}
          {!user && (
            <>
              <li className="user-navbar-mobile-divider"></li>
              <li>
                <Link
                  to="/login"
                  className={isActive('/login') ? 'user-navbar-mobile-active' : ''}
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className={isActive('/register') ? 'user-navbar-mobile-active' : ''}
                  onClick={toggleMobileMenu}
                >
                  <UserPlus size={16} /> Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default PmcyAdminNavBar;