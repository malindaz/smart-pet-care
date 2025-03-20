import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Admin/AdminNavBar.css';

const AdminNavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for admin data
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    
    if (adminToken && adminData) {
      try {
        const parsedAdminData = JSON.parse(adminData);
        setAdmin(parsedAdminData);
      } catch (error) {
        console.error('Error parsing admin data:', error);
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
      const response = await fetch('http://localhost:5000/api/admin/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Clear localStorage regardless of server response
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      
      // Reset admin state
      setAdmin(null);
      
      // Close dropdowns
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
      
      // Redirect to admin login
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage and redirect even if there's an error
      localStorage.clear();
      setAdmin(null);
      navigate('/admin/login');
    }
  };

  useEffect(() => {
    const closeDropdowns = (e) => {
      if (isProfileDropdownOpen && !e.target.closest('.admin-navbar-profile')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', closeDropdowns);
    return () => document.removeEventListener('click', closeDropdowns);
  }, [isProfileDropdownOpen]);

  return (
    <header className={`admin-navbar-header ${isScrolled ? 'admin-navbar-scrolled' : ''}`}>
      <div className="admin-navbar-container">
        <div className="admin-navbar-logo">
          <Link to="/admin/dashboard">
            <img src="/assets/images/logo.png" alt="petpal+" className="admin-navbar-logo-img" />
            <span className="admin-navbar-logo-text">PetPal<span className="admin-navbar-plus">+</span> <span className="admin-navbar-admin-text">Admin</span></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="admin-navbar-nav">
          <ul className="admin-navbar-links">
            <li className="admin-navbar-link-item">
              <Link to="/admin/dashboard" className="admin-navbar-link">Dashboard</Link>
            </li>
            <li className="admin-navbar-link-item">
              <Link to="/admin/users" className="admin-navbar-link">Users</Link>
            </li>
            <li className="admin-navbar-link-item">
              <Link to="/admin/vets" className="admin-navbar-link">Veterinarians</Link>
            </li>
            <li className="admin-navbar-link-item">
              <Link to="/admin/appointments" className="admin-navbar-link">Appointments</Link>
            </li>
            <li className="admin-navbar-link-item">
              <Link to="/admin/pharmacy" className="admin-navbar-link">Pharmacy</Link>
            </li>
            <li className="admin-navbar-link-item">
              <Link to="/admin/orders" className="admin-navbar-link">Orders</Link>
            </li>
            <li className="admin-navbar-link-item">
              <Link to="/admin/reports" className="admin-navbar-link">Reports</Link>
            </li>
          </ul>
        </nav>

        {/* Admin Profile Section */}
        <div className="admin-navbar-profile" onClick={(e) => e.stopPropagation()}>
          {admin ? (
            <div className="admin-navbar-user">
              <div className="admin-navbar-profile-icon" onClick={toggleProfileDropdown}>
                {admin.profileImage ? (
                  <img src={admin.profileImage} alt={admin.username || 'Admin'} className="admin-navbar-avatar" />
                ) : (
                  <div className="admin-navbar-avatar-placeholder">
                    {admin.username ? admin.username.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
              </div>
              {isProfileDropdownOpen && (
                <div className="admin-navbar-dropdown">
                  <div className="admin-navbar-dropdown-header">
                    <span className="admin-navbar-greeting">Hello, {admin.username || 'Admin'}!</span>
                  </div>
                  <ul className="admin-navbar-dropdown-menu">
                    <li className="admin-navbar-dropdown-item">
                      <Link to="/admin/profile" className="admin-navbar-dropdown-link" onClick={() => setIsProfileDropdownOpen(false)}>
                        <i className="fas fa-user"></i> My Profile
                      </Link>
                    </li>
                    <li className="admin-navbar-dropdown-item">
                      <Link to="/admin/settings" className="admin-navbar-dropdown-link" onClick={() => setIsProfileDropdownOpen(false)}>
                        <i className="fas fa-cog"></i> Settings
                      </Link>
                    </li>
                    <li className="admin-navbar-dropdown-divider"></li>
                    <li className="admin-navbar-dropdown-item">
                      <button className="admin-navbar-logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="admin-navbar-auth-buttons">
              <Link to="/admin/login" className="admin-navbar-login-btn">Login</Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="admin-navbar-mobile-toggle" onClick={toggleMobileMenu}>
          <div className={`admin-navbar-hamburger ${isMobileMenuOpen ? 'admin-navbar-active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`admin-navbar-mobile-menu ${isMobileMenuOpen ? 'admin-navbar-open' : ''}`}>
        <ul className="admin-navbar-mobile-links">
          <li><Link to="/admin/dashboard" onClick={toggleMobileMenu}>Dashboard</Link></li>
          <li><Link to="/admin/users" onClick={toggleMobileMenu}>Users</Link></li>
          <li><Link to="/admin/vets" onClick={toggleMobileMenu}>Veterinarians</Link></li>
          <li><Link to="/admin/appointments" onClick={toggleMobileMenu}>Appointments</Link></li>
          <li><Link to="/admin/pharmacy" onClick={toggleMobileMenu}>Pharmacy</Link></li>
          <li><Link to="/admin/orders" onClick={toggleMobileMenu}>Orders</Link></li>
          <li><Link to="/admin/reports" onClick={toggleMobileMenu}>Reports</Link></li>
          {admin && (
            <>
              <li className="admin-navbar-mobile-divider"></li>
              <li><Link to="/admin/profile" onClick={toggleMobileMenu}>My Profile</Link></li>
              <li><Link to="/admin/settings" onClick={toggleMobileMenu}>Settings</Link></li>
              <li><button className="admin-navbar-mobile-logout-btn" onClick={handleLogout}>Logout</button></li>
            </>
          )}
          {!admin && (
            <>
              <li className="admin-navbar-mobile-divider"></li>
              <li><Link to="/admin/login" onClick={toggleMobileMenu}>Login</Link></li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default AdminNavBar;