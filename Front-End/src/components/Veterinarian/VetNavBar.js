import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  LogOut, 
  User, 
  Bell, 
  BarChart2, 
  FileText, 
  Users, 
  MessageSquare, 
  Settings,
  HelpCircle
} from 'lucide-react';
import '../../css/Veterinarian/VetNavBar.css';
import Logo from '../../assets/images/Logo.png';

const VetNavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [vet, setVet] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check localStorage for vet data
    const vetToken = localStorage.getItem('vetToken');
    const vetData = localStorage.getItem('vetData');
    
    if (vetToken && vetData) {
      try {
        const parsedVetData = JSON.parse(vetData);
        setVet(parsedVetData);
      } catch (error) {
        console.error('Error parsing vet data:', error);
      }
    }

    // Mock notifications - replace with actual notification logic
    setNotifications([
      { id: 1, text: 'New appointment request from John Doe', read: false, time: '15 minutes ago' },
      { id: 2, text: 'Medical record updated for patient Rex', read: false, time: '2 hours ago' },
      { id: 3, text: 'Welcome to PetWellHub Vet Portal!', read: true, time: '2 days ago' }
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
      const response = await fetch('http://localhost:5000/api/vets/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vetToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Clear localStorage regardless of server response
      localStorage.removeItem('vetToken');
      localStorage.removeItem('vetData');
      localStorage.removeItem('vetEmail');
      
      // Reset vet state
      setVet(null);
      
      // Close dropdowns
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
      setIsNotificationDropdownOpen(false);
      
      // Redirect to vet login
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage and redirect even if there's an error
      localStorage.clear();
      setVet(null);
      navigate('/');
    }
  };

  useEffect(() => {
    const closeDropdowns = (e) => {
      if (isProfileDropdownOpen && !e.target.closest('.vet-navbar-profile')) {
        setIsProfileDropdownOpen(false);
      }
      if (isNotificationDropdownOpen && !e.target.closest('.vet-navbar-notification')) {
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
    <header className={`vet-navbar-header ${isScrolled ? 'vet-navbar-scrolled' : ''}`}>
      <div className="vet-navbar-container">
        <div className="vet-navbar-logo">
          <Link to="/vetdashboard">
            <img src={Logo} alt="Petwellhub" className="vet-navbar-logo-img" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="vet-navbar-nav">
          <ul className="vet-navbar-links">
            <li className="vet-navbar-link-item">
              <Link to="/vet-dashboard" className={`vet-navbar-link ${isActive('/vet/dashboard') ? 'vet-navbar-active' : ''}`}>Dashboard</Link>
            </li>
            <li className="vet-navbar-link-item">
              <Link to="/vetappointments" className={`vet-navbar-link ${isActive('/vet/appointments') ? 'vet-navbar-active' : ''}`}>Appointments</Link>
            </li>
            <li className="vet-navbar-link-item">
              <Link to="/vet/patients" className={`vet-navbar-link ${isActive('/vet/patients') ? 'vet-navbar-active' : ''}`}>Patients</Link>
            </li>
            <li className="vet-navbar-link-item">
              <Link to="/vet/medical-records" className={`vet-navbar-link ${isActive('/vet/medical-records') ? 'vet-navbar-active' : ''}`}>Medical Records</Link>
            </li>
            <li className="vet-navbar-link-item">
              <Link to="/vet/messages" className={`vet-navbar-link ${isActive('/vet/messages') ? 'vet-navbar-active' : ''}`}>Messages</Link>
            </li>
          </ul>
        </nav>

        {/* Notification and Profile Section */}
        <div className="vet-navbar-user-section">
          {/* Notification Bell */}
          <div className="vet-navbar-notification" onClick={(e) => e.stopPropagation()}>
            <div className="vet-navbar-notification-icon" onClick={toggleNotificationDropdown}>
              <Bell size={22} />
              {unreadNotifications > 0 && (
                <span className="vet-navbar-notification-badge">{unreadNotifications}</span>
              )}
            </div>
            
            {isNotificationDropdownOpen && (
              <div className="vet-navbar-notification-dropdown">
                <div className="vet-navbar-notification-header">
                  <span className="vet-navbar-notification-title">Notifications</span>
                  {unreadNotifications > 0 && (
                    <button className="vet-navbar-mark-read" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <ul className="vet-navbar-notification-list">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <li 
                        key={notification.id} 
                        className={`vet-navbar-notification-item ${notification.read ? 'vet-navbar-read' : 'vet-navbar-unread'}`}
                      >
                        <div className="vet-navbar-notification-content">
                          <p className="vet-navbar-notification-text">{notification.text}</p>
                          <span className="vet-navbar-notification-time">{notification.time}</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="vet-navbar-notification-empty">No notifications</li>
                  )}
                </ul>
                <div className="vet-navbar-notification-footer">
                  <Link to="/vetnotifications" className="vet-navbar-view-all" onClick={() => setIsNotificationDropdownOpen(false)}>
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Profile Section */}
          <div className="vet-navbar-profile" onClick={(e) => e.stopPropagation()}>
            <div className="vet-navbar-user">
              <div className="vet-navbar-profile-icon" onClick={toggleProfileDropdown}>
                {vet && vet.profileImage ? (
                  <img src={vet.profileImage} alt={vet.fullName || 'Veterinarian'} className="vet-navbar-avatar" />
                ) : (
                  <div className="vet-navbar-avatar-placeholder">
                    <User size={20} />
                  </div>
                )}
              </div>
              {isProfileDropdownOpen && (
                <div className="vet-navbar-dropdown">
                  <div className="vet-navbar-dropdown-header">
                    <span className="vet-navbar-greeting">Hello, Dr. {vet ? vet.fullName : 'User'}!</span>
                  </div>
                  <ul className="vet-navbar-dropdown-menu">
                    <li className="vet-navbar-dropdown-item">
                      <Link to="/vet/profile" className="vet-navbar-dropdown-link" onClick={() => setIsProfileDropdownOpen(false)}>
                        <User size={16} /> My Profile
                      </Link>
                    </li>
                    <li className="vet-navbar-dropdown-item">
                      <Link to="/vet/settings" className="vet-navbar-dropdown-link" onClick={() => setIsProfileDropdownOpen(false)}>
                        <Settings size={16} /> Settings
                      </Link>
                    </li>
                    <li className="vet-navbar-dropdown-item">
                      <Link to="/vet/help" className="vet-navbar-dropdown-link" onClick={() => setIsProfileDropdownOpen(false)}>
                        <HelpCircle size={16} /> Help & Support
                      </Link>
                    </li>
                    <li className="vet-navbar-dropdown-divider"></li>
                    <li className="vet-navbar-dropdown-item">
                      <button className="vet-navbar-logout-btn" onClick={handleLogout}>
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
        <div className="vet-navbar-mobile-toggle" onClick={toggleMobileMenu}>
          <div className={`vet-navbar-hamburger ${isMobileMenuOpen ? 'vet-navbar-active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`vet-navbar-mobile-menu ${isMobileMenuOpen ? 'vet-navbar-open' : ''}`}>
        <ul className="vet-navbar-mobile-links">
          <li>
            <Link 
              to="/vet-dashboard" 
              className={isActive('/vet/dashboard') ? 'vet-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <BarChart2 size={16} /> Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/vetappointments" 
              className={isActive('/vet/appointments') ? 'vet-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <Calendar size={16} /> Appointments
            </Link>
          </li>
          <li>
            <Link 
              to="/vet/patients" 
              className={isActive('/vet/patients') ? 'vet-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <Users size={16} /> Patients
            </Link>
          </li>
          <li>
            <Link 
              to="/vet/medical-records" 
              className={isActive('/vet/medical-records') ? 'vet-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <FileText size={16} /> Medical Records
            </Link>
          </li>
          <li>
            <Link 
              to="/vet/messages" 
              className={isActive('/vet/messages') ? 'vet-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <MessageSquare size={16} /> Messages
            </Link>
          </li>
          <li>
            <Link 
              to="/vetnotifications" 
              className={isActive('/vet/notifications') ? 'vet-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <Bell size={16} /> Notifications
              {unreadNotifications > 0 && <span className="vet-navbar-mobile-notification-badge">{unreadNotifications}</span>}
            </Link>
          </li>
          <li className="vet-navbar-mobile-divider"></li>
          <li>
            <Link 
              to="/vet/profile" 
              className={isActive('/vet/profile') ? 'vet-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <User size={16} /> My Profile
            </Link>
          </li>
          <li>
            <Link 
              to="/vet/settings" 
              className={isActive('/vet/settings') ? 'vet-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <Settings size={16} /> Settings
            </Link>
          </li>
          <li>
            <Link 
              to="/vet/help" 
              className={isActive('/vet/help') ? 'vet-navbar-mobile-active' : ''} 
              onClick={toggleMobileMenu}
            >
              <HelpCircle size={16} /> Help & Support
            </Link>
          </li>
          <li>
            <button className="vet-navbar-mobile-logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default VetNavBar;