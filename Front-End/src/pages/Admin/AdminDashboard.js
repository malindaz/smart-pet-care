import React from 'react';
import { Link } from "react-router-dom";
import '../../css/Admin/admindashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsersCog,
  faUserMd,
  faPaw,
  faCalendarAlt,
  faClinicMedical,
  faChartLine,
  faBell,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import AdminNavBar from '../../components/Admin/AdminNavBar';
import Footer from '../../components/Footer';

const AdminDashboard = () => {
  return (
    <>
    <AdminNavBar/>
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Smart Pet Care Management System</p>
      </div>

      <div className="admin-dashboard-grid">
        {/* Card 1 - Manage Roles */}
        <div className="admin-dashboard-card manage-roles" style={{"--animation-order": 1}}>
          <div className="card-overlay"></div>
          <div className="admin-dashboard-card-content">
            <div className="admin-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faUsersCog} className="admin-dashboard-icon" />
            </div>
            <h2>Manage Roles</h2>
            <p>Assign and modify user permissions and system roles</p>
          </div>
        </div>

        {/* Card 2 - Manage Veterinarian Requests */}
        <Link to="/vetrequests" className="admin-dashboard-card manage-vet-requests" style={{"--animation-order": 2}}>
          <div className="card-overlay"></div>
          <div className="admin-dashboard-card-content">
            <div className="admin-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faUserMd} className="admin-dashboard-icon" />
            </div>
            <h2>Manage Veterinarian Requests</h2>
            <p>Review and approve veterinarian registration applications</p>
          </div>
        </Link>

        {/* Card 3 - Manage Pet Health Records */}
        <div className="admin-dashboard-card manage-health-records" style={{"--animation-order": 3}}>
          <div className="card-overlay"></div>
          <div className="admin-dashboard-card-content">
            <div className="admin-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faPaw} className="admin-dashboard-icon" />
            </div>
            <h2>Manage Pet Health Records</h2>
            <p>View and manage all pet health data and medical histories</p>
          </div>
        </div>

        {/* Card 4 - Manage Appointments */}
        <div className="admin-dashboard-card manage-appointments" style={{"--animation-order": 4}}>
          <div className="card-overlay"></div>
          <div className="admin-dashboard-card-content">
            <div className="admin-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faCalendarAlt} className="admin-dashboard-icon" />
            </div>
            <h2>Manage Appointments</h2>
            <p>View and oversee all scheduled pet care appointments</p>
          </div>
        </div>

        {/* Card 5 - Clinic Management */}
        <div className="admin-dashboard-card clinic-management" style={{"--animation-order": 5}}>
          <div className="card-overlay"></div>
          <div className="admin-dashboard-card-content">
            <div className="admin-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faClinicMedical} className="admin-dashboard-icon" />
            </div>
            <h2>Clinic Management</h2>
            <p>Manage clinic information, hours, and services</p>
          </div>
        </div>

        {/* Card 6 - Analytics & Reports */}
        <div className="admin-dashboard-card analytics-reports" style={{"--animation-order": 6}}>
          <div className="card-overlay"></div>
          <div className="admin-dashboard-card-content">
            <div className="admin-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faChartLine} className="admin-dashboard-icon" />
            </div>
            <h2>Analytics & Reports</h2>
            <p>View system usage statistics and generate reports</p>
          </div>
        </div>

        {/* Card 7 - Notifications */}
        <div className="admin-dashboard-card notifications" style={{"--animation-order": 7}}>
          <div className="card-overlay"></div>
          <div className="admin-dashboard-card-content">
            <div className="admin-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faBell} className="admin-dashboard-icon" />
            </div>
            <h2>Notifications</h2>
            <p>Manage system notifications and user alerts</p>
          </div>
        </div>

        {/* Card 8 - System Settings */}
        <div className="admin-dashboard-card system-settings" style={{"--animation-order": 8}}>
          <div className="card-overlay"></div>
          <div className="admin-dashboard-card-content">
            <div className="admin-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faCog} className="admin-dashboard-icon" />
            </div>
            <h2>System Settings</h2>
            <p>Configure and customize system parameters</p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default AdminDashboard;