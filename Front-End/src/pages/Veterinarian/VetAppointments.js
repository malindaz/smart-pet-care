import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import VetNavBar from '../../components/Veterinarian/VetNavBar';
import Footer from '../../components/Footer';
import '../../css/Veterinarian/vetappointments.css';

const VetAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/appointments/all');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments. Please try again later.');
        toast.error('Failed to load appointments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [refreshTrigger]);

  // Handle Accept
  const handleAccept = async (id) => {
    try {
      setAppointments(prev =>
        prev.map(app => (app._id === id ? { ...app, processing: true } : app))
      );
      
      await axios.put(`http://localhost:5000/api/appointments/${id}/accept`);
      
      setAppointments(prev =>
        prev.map(app => (app._id === id ? { ...app, status: 'confirmed', processing: false } : app))
      );
      
      toast.success('Appointment confirmed successfully');
    } catch (error) {
      console.error('Error accepting appointment:', error);
      
      setAppointments(prev =>
        prev.map(app => (app._id === id ? { ...app, processing: false } : app))
      );
      
      toast.error('Failed to confirm appointment');
    }
  };

  // Handle Reject function
  const handleReject = async (id) => {
    try {
      setAppointments(prev =>
        prev.map(app => (app._id === id ? { ...app, processing: true } : app))
      );
      
      await axios.put(`http://localhost:5000/api/appointments/${id}/reject`);
      
      setAppointments(prev =>
        prev.map(app => (app._id === id ? { ...app, status: 'cancelled', processing: false } : app))
      );
      
      toast.info('Appointment cancelled');
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      
      setAppointments(prev =>
        prev.map(app => (app._id === id ? { ...app, processing: false } : app))
      );
      
      toast.error('Failed to cancel appointment');
    }
  };

  // Handle Complete function
  const handleComplete = async (id) => {
    try {
      setAppointments(prev =>
        prev.map(app => (app._id === id ? { ...app, processing: true } : app))
      );
      
      await axios.put(`http://localhost:5000/api/appointments/${id}/complete`);
      
      setAppointments(prev =>
        prev.map(app => (app._id === id ? { ...app, status: 'completed', processing: false } : app))
      );
      
      toast.success('Appointment marked as completed');
    } catch (error) {
      console.error('Error completing appointment:', error);
      
      setAppointments(prev =>
        prev.map(app => (app._id === id ? { ...app, processing: false } : app))
      );
      
      toast.error('Failed to complete appointment');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(app => app.status === filter);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <VetNavBar />
      <div className="vet-viewappointment-container">
        <div className="vet-viewappointment-header">
          <h1>Appointment Management</h1>
          <p>View and manage all your upcoming pet appointments</p>
        </div>
        
        <div className="vet-viewappointment-controls">
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
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <button 
            className="vet-viewappointment-refresh-btn"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        {error && (
          <div className="vet-viewappointment-error">
            <p>{error}</p>
            <button 
              className="vet-viewappointment-btn vet-viewappointment-btn-retry"
              onClick={handleRefresh}
            >
              Try Again
            </button>
          </div>
        )}

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
                  <th>Pet Type</th>
                  <th>Owner</th>
                  <th>Contact</th>
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
                    <td>{app.petType}</td>
                    <td>{app.ownerName}</td>
                    <td>
                      <div className="vet-viewappointment-contact">
                        <div><i className="fas fa-envelope"></i> {app.email}</div>
                        <div><i className="fas fa-phone"></i> {app.phone}</div>
                      </div>
                    </td>
                    <td>{formatDate(app.date)}</td>
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
                            disabled={app.processing}
                          >
                            {app.processing ? 'Processing...' : 'Accept'}
                          </button>
                          <button 
                            className="vet-viewappointment-btn vet-viewappointment-btn-reject"
                            onClick={() => handleReject(app._id)}
                            disabled={app.processing}
                          >
                            {app.processing ? 'Processing...' : 'Reject'}
                          </button>
                        </>
                      )}
                      {app.status === 'confirmed' && (
                        <>
                          <button 
                            className="vet-viewappointment-btn vet-viewappointment-btn-complete"
                            onClick={() => handleComplete(app._id)}
                            disabled={app.processing}
                          >
                            {app.processing ? 'Processing...' : 'Complete'}
                          </button>
                          <span className="vet-viewappointment-status-icon">
                            <i className="fas fa-check-circle"></i>
                          </span>
                        </>
                      )}
                      {app.status === 'completed' && (
                        <span className="vet-viewappointment-status-icon completed">
                          <i className="fas fa-clipboard-check"></i> Completed
                        </span>
                      )}
                      {app.status === 'cancelled' && (
                        <span className="vet-viewappointment-status-icon cancelled">
                          <i className="fas fa-times-circle"></i> Cancelled
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