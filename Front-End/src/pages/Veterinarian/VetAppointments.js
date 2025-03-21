import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VetNavBar from '../../components/Veterinarian/VetNavBar';
import Footer from '../../components/Footer';
import '../../css/Veterinarian/vetappointments.css';

const VetAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/appointments/all');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Handle Accept
  const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/accept`);
      setAppointments(prev =>
        prev.map(app => (app._id === id ? { ...app, status: 'confirmed' } : app))
      );
    } catch (error) {
      console.error('Error accepting appointment:', error);
    }
  };

  // Handle Reject
  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/reject`);
      setAppointments(prev =>
        prev.map(app => (app._id === id ? { ...app, status: 'cancelled' } : app))
      );
    } catch (error) {
      console.error('Error rejecting appointment:', error);
    }
  };

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(app => app.status === filter);

  return (
    <>
      {/* <VetNavBar /> */}
      <div className="vet-viewappointment-container">
        <div className="vet-viewappointment-header">
          <h1>Appointment Management</h1>
          <p>View and manage all your upcoming pet appointments</p>
        </div>
        
        <div className="vet-viewappointment-filter">
          <span>Filter by status: </span>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="vet-viewappointment-select"
          >
            <option value="all">All Appointments</option>
            <option value="scheduled">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {isLoading ? (
          <div className="vet-viewappointment-loading">
            <div className="vet-viewappointment-spinner"></div>
            <p>Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="vet-viewappointment-empty">
            <p>No appointments found in this category.</p>
          </div>
        ) : (
          <div className="vet-viewappointment-table-container">
            <table className="vet-viewappointment-table">
              <thead>
                <tr>
                  <th>Pet Name</th>
                  <th>Owner</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(app => (
                  <tr key={app._id} className={`vet-viewappointment-row-${app.status}`}>
                    <td>{app.petName}</td>
                    <td>{app.ownerName}</td>
                    <td>{new Date(app.date).toLocaleDateString()}</td>
                    <td>{app.time}</td>
                    <td>{app.serviceType}</td>
                    <td>
                      <span className={`vet-viewappointment-status vet-viewappointment-status-${app.status}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="vet-viewappointment-actions">
                      {app.status === 'scheduled' && (
                        <>
                          <button 
                            className="vet-viewappointment-btn vet-viewappointment-btn-accept"
                            onClick={() => handleAccept(app._id)}
                          >
                            Accept
                          </button>
                          <button 
                            className="vet-viewappointment-btn vet-viewappointment-btn-reject"
                            onClick={() => handleReject(app._id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {app.status === 'confirmed' && (
                        <span className="vet-viewappointment-status-icon">
                          Confirmed <i className="fas fa-check-circle"></i>
                        </span>
                      )}
                      {app.status === 'cancelled' && (
                        <span className="vet-viewappointment-status-icon">
                          Cancelled <i className="fas fa-times-circle"></i>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default VetAppointments;