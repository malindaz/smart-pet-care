import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import '../css/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer-container">
      <div className="footer-main">
        <div className="footer-column">
          <div className="footer-logo">
            <h2>PetPal</h2>
            <p>Smart Pet Care Management System</p>
          </div>
          <p className="footer-tagline">
            Simplifying pet care through technology, one paw at a time.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" className="footer-social-icon" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" className="footer-social-icon" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" className="footer-social-icon" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" className="footer-social-icon" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
        
        <div className="footer-column">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/blog">Pet Care Blog</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3 className="footer-title">Services</h3>
          <ul className="footer-links">
            <li><Link to="/health-tracking">Health Tracking</Link></li>
            <li><Link to="/medication-reminders">Medication Reminders</Link></li>
            <li><Link to="/nutrition-planning">Nutrition Planning</Link></li>
            <li><Link to="/activity-monitoring">Activity Monitoring</Link></li>
            <li><Link to="/vet-appointments">Vet Appointments</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3 className="footer-title">Contact Us</h3>
          <address className="footer-contact">
            <div className="footer-contact-item">
              <MdLocationOn className="footer-contact-icon" />
              <span>123 Pet Street, Furry City, 90210</span>
            </div>
            <div className="footer-contact-item">
              <MdPhone className="footer-contact-icon" />
              <span><a href="tel:+1234567890">+1 (234) 567-890</a></span>
            </div>
            <div className="footer-contact-item">
              <MdEmail className="footer-contact-icon" />
              <span><a href="mailto:support@petpal.com">support@petpal.com</a></span>
            </div>
          </address>
        </div>
      </div>
      
      <div className="footer-newsletter">
        <h3>Stay Updated</h3>
        <p>Subscribe to our newsletter for pet care tips and updates.</p>
        <form className="footer-form">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="footer-input" 
            required 
          />
          <button type="submit" className="footer-button">Subscribe</button>
        </form>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-legal">
          <span>&copy; {currentYear} PetPal. All rights reserved.</span>
          <div className="footer-legal-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;