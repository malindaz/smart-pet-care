import React from 'react';
import '../../css/Veterinarian/vetdashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faPaw,
  faFileMedical,
  faUserClock,
  faPrescriptionBottleAlt,
  faChartLine,
  faUserMd,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import VetNavBar from '../../components/Veterinarian/VetNavBar';
import Footer from '../../components/Footer';

const VetDashboard = () => {
  return (
    <>
    <VetNavBar/>
    <div className="vet-dashboard-container">
      <div className="vet-dashboard-header">
        <h1>Veterinarian Dashboard</h1>
        <p>Smart Pet Care Management System</p>
      </div>

      <div className="vet-dashboard-grid">
        {/* Card 1 - View Appointments */}
        <div className="vet-dashboard-card view-appointments" style={{"--animation-order": 1}}>
          <div className="card-overlay"></div>
          <div className="vet-dashboard-card-content">
            <div className="vet-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faCalendarCheck} className="vet-dashboard-icon" />
            </div>
            <h2>View Appointments</h2>
            <p>Check and manage your upcoming pet appointments</p>
          </div>
        </div>

        {/* Card 2 - Pet Records */}
        <div className="vet-dashboard-card pet-records" style={{"--animation-order": 2}}>
          <div className="card-overlay"></div>
          <div className="vet-dashboard-card-content">
            <div className="vet-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faPaw} className="vet-dashboard-icon" />
            </div>
            <h2>Pet Records</h2>
            <p>Access and update pet health records and histories</p>
          </div>
        </div>

        {/* Card 3 - Create Medical Reports */}
        <div className="vet-dashboard-card medical-reports" style={{"--animation-order": 3}}>
          <div className="card-overlay"></div>
          <div className="vet-dashboard-card-content">
            <div className="vet-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faFileMedical} className="vet-dashboard-icon" />
            </div>
            <h2>Medical Reports</h2>
            <p>Create and manage detailed medical reports for pets</p>
          </div>
        </div>

        {/* Card 4 - Appointment History */}
        <div className="vet-dashboard-card appointment-history" style={{"--animation-order": 4}}>
          <div className="card-overlay"></div>
          <div className="vet-dashboard-card-content">
            <div className="vet-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faUserClock} className="vet-dashboard-icon" />
            </div>
            <h2>Appointment History</h2>
            <p>View complete history of past pet consultations</p>
          </div>
        </div>

        {/* Card 5 - Prescriptions */}
        <div className="vet-dashboard-card prescriptions" style={{"--animation-order": 5}}>
          <div className="card-overlay"></div>
          <div className="vet-dashboard-card-content">
            <div className="vet-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="vet-dashboard-icon" />
            </div>
            <h2>Prescriptions</h2>
            <p>Manage and issue medication prescriptions for pets</p>
          </div>
        </div>

        {/* Card 6 - Analytics */}
        <div className="vet-dashboard-card analytics" style={{"--animation-order": 6}}>
          <div className="card-overlay"></div>
          <div className="vet-dashboard-card-content">
            <div className="vet-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faChartLine} className="vet-dashboard-icon" />
            </div>
            <h2>Analytics</h2>
            <p>View statistics and insights about your practice</p>
          </div>
        </div>

        {/* Card 7 - My Profile */}
        <div className="vet-dashboard-card profile" style={{"--animation-order": 7}}>
          <div className="card-overlay"></div>
          <div className="vet-dashboard-card-content">
            <div className="vet-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faUserMd} className="vet-dashboard-icon" />
            </div>
            <h2>My Profile</h2>
            <p>Update your professional information and credentials</p>
          </div>
        </div>

        {/* Card 8 - Settings */}
        <div className="vet-dashboard-card settings" style={{"--animation-order": 8}}>
          <div className="card-overlay"></div>
          <div className="vet-dashboard-card-content">
            <div className="vet-dashboard-icon-wrapper">
              <FontAwesomeIcon icon={faCog} className="vet-dashboard-icon" />
            </div>
            <h2>Settings</h2>
            <p>Configure your dashboard preferences and notifications</p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default VetDashboard;