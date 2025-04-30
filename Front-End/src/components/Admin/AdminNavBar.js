import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, pill, Calendar, ShoppingBag, Settings, LogOut, Bell, User, HelpCircle } from 'lucide-react';
import '../../css/Admin/AdminNavBar.css';
import Logo from '../../assets/images/Logo.png';

const AdminNavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

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

    // Mock notifications - replace with actual notification logic
    setNotifications([
      { id: 1, text: 'New vet application submitted', read: false, time: '30 minutes ago' },
      { id: 2, text: 'Inventory alert: Low stock on Pet Vitamins', read: false, time: '2 hours ago' },
      { id: 3, text: 'Monthly report is ready for review', read: true, time: '1 day ago' }
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
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminLevel');
      
      // Reset admin state
      setAdmin(null);
      
      // Close dropdowns
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
      setIsNotificationDropdownOpen(false);
      
      // Redirect to admin login
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage and redirect even if there's an error
      localStorage.clear();
      setAdmin(null);
      navigate('/');
    }
  };

  useEffect(() => {
    const closeDropdowns = (e) => {
      if (isProfileDropdownOpen && !e.target.closest('.admin-navbar-profile')) {
        setIsProfileDropdownOpen(false);
      }
      if (isNotificationDropdownOpen && !e.target.closest('.admin-navbar-notification')) {
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
    <header className={`admin-navbar-header ${isScrolled ? 'admin-navbar-scrolled' : ''}`}>
      <div className="admin-navbar-container">
        <div className="admin-navbar-logo">
          <Link to="/admin/dashboard">
            <img src={Logo} alt="Petwellhub Admin" className="admin-navbar-logo-img" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="admin-navbar-nav">
          <ul className="admin-navbar-links">
            <li className="admin-navbar-link-item">
              <Link to="/admin/dashboard" className={`admin-navbar-link ${isActive('/admin/dashboard') ? 'admin-navbar-active' : ''}`}>
                <LayoutDashboard size={18} className="admin-navbar-icon" />
                Dashboard
              </Link>
            </li>
            <li className="admin-navbar-link-item">
              <Link to="/admin/users" className={`admin-navbar-link ${isActive('/admin/users') ? 'admin-navbar-active' : ''}`}>
                <Users size={18} className="admin-navbar-icon" />
                Users
              </Link>
            </li>
            <li className="admin-navbar-link-item">
              <Link to="/admin/pharmacy" className={`admin-navbar-link ${isActive('/admin/pharmacy') ? 'admin-navbar-active' : ''}`}>
                <pill size={18} className="admin-navbar-icon" />
                Pharmacy
              </Link>
            </li>
            <li className="admin-navbar-link-item">
              <Link to="/admin/appointments" className={`admin-navbar-link ${isActive('/admin/appointments') ? 'admin-navbar-active' : ''}`}>
                <Calendar size={18} className="admin-navbar-icon" />
                Appointments
              </Link>
            </li>
            <li className="admin-navbar-link-item">
              <Link to="/admin/orders" className={`admin-navbar-link ${isActive('/admin/orders') ? 'admin-navbar-active' : ''}`}>
                <ShoppingBag size={18} className="admin-navbar-icon" />
                Orders
              </Link>
            </li>
            <li className="admin-navbar-link-item">
              <Link to="/admin/settings" className={`admin-navbar-link ${isActive('/admin/settings') ? 'admin-navbar-active' : ''}`}>
                <Settings size={18} className="admin-navbar-icon" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>

        {/* Admin User Section with Notifications and Profile */}
        <div className="admin-navbar-user-section">
          {/* Notification Bell */}
          <div className="admin-navbar-notification" onClick={(e) => e.stopPropagation()}>
            <div className="admin-navbar-notification-icon" onClick={toggleNotificationDropdown}>
              <Bell size={22} />
              {unreadNotifications > 0 && (
                <span className="admin-navbar-notification-badge">{unreadNotifications}</span>
              )}
            </div>
            
            {isNotificationDropdownOpen && (
              <div className="admin-navbar-notification-dropdown">
                <div className="admin-navbar-notification-header">
                  <span className="admin-navbar-notification-title">Notifications</span>
                  {unreadNotifications > 0 && (
                    <button className="admin-navbar-mark-read" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <ul className="admin-navbar-notification-list">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <li 
                        key={notification.id} 
                        className={`admin-navbar-notification-item ${notification.read ? 'admin-navbar-read' : 'admin-navbar-unread'}`}
                      >
                        <div className="admin-navbar-notification-content">
                          <p className="admin-navbar-notification-text">{notification.text}</p>
                          <span className="admin-navbar-notification-time">{notification.time}</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="admin-navbar-notification-empty">No notifications</li>
                  )}
                </ul>
                <div className="admin-navbar-notification-footer">
                  <Link to="/admin/notifications" className="admin-navbar-view-all" onClick={() => setIsNotificationDropdownOpen(false)}>
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="admin-navbar-profile" onClick={(e) => e.stopPropagation()}>
            <div className="admin-navbar-user">
              <div className="admin-navbar-profile-icon" onClick={toggleProfileDropdown}>
                {admin && admin.profileImage ? (
                  <img src={admin.profileImage} alt={admin.username || 'Admin'} className="admin-navbar-avatar" />
                ) : (
                  <div className="admin-navbar-avatar-placeholder">
                    <User size={20} />
                  </div>
                )}
              </div>
              {isProfileDropdownOpen && (
                <div className="admin-navbar-dropdown">
                  <div className="admin-navbar-dropdown-header">
                    <span className="admin-navbar-greeting">Hello, {admin ? admin.username : 'Admin'}!</span>
                  </div>
                  <ul className="admin-navbar-dropdown-menu">
                    <li className="admin-navbar-dropdown-item">
                      <Link to="/profile" className="admin-navbar-dropdown-link" onClick={() => setIsProfileDropdownOpen(false)}>
                        <User size={16} /> My Profile
                      </Link>
                    </li>
                    <li className="admin-navbar-dropdown-item">
                      <Link to="/admin/help" className="admin-navbar-dropdown-link" onClick={() => setIsProfileDropdownOpen(false)}>
                        <HelpCircle size={16} /> Help & Support
                      </Link>
                    </li>
                    <li className="admin-navbar-dropdown-divider"></li>
                    <li className="admin-navbar-dropdown-item">
                      <button className="admin-navbar-logout-btn" onClick={handleLogout}>
                        <LogOut size={16} /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
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
          <li>
            <Link 
              to="/admin/dashboard" 
              className={isActive('/admin/dashboard') ? 'admin-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/users" 
              className={isActive('/admin/users') ? 'admin-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <Users size={16} /> Users
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/pharmacy" 
              className={isActive('/admin/pharmacy') ? 'admin-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <pill size={16} /> Pharmacy
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/appointments" 
              className={isActive('/admin/appointments') ? 'admin-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <Calendar size={16} /> Appointments
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/orders" 
              className={isActive('/admin/orders') ? 'admin-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <ShoppingBag size={16} /> Orders
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/settings" 
              className={isActive('/admin/settings') ? 'admin-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <Settings size={16} /> Settings
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/notifications" 
              className={isActive('/admin/notifications') ? 'admin-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <Bell size={16} /> Notifications
              {unreadNotifications > 0 && <span className="admin-navbar-mobile-notification-badge">{unreadNotifications}</span>}
            </Link>
          </li>
          <li className="admin-navbar-mobile-divider"></li>
          <li>
            <Link 
              to="/admin/profile" 
              className={isActive('/admin/profile') ? 'admin-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <User size={16} /> My Profile
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/help" 
              className={isActive('/admin/help') ? 'admin-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <HelpCircle size={16} /> Help & Support
            </Link>
          </li>
          <li>
            <button className="admin-navbar-mobile-logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default AdminNavBar;