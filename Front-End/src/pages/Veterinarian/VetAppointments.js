import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VetNavBar from '../../components/Veterinarian/VetNavBar';
import Footer from '../../components/Footer';
import '../../css/Veterinarian/vetappointments.css'

const VetAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments/all');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
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

  return (
    <>
    {/* <VetNavBar/> */}
    <div>
      <h2>Vet Appointments</h2>
      <table>
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
          {appointments.map(app => (
            <tr key={app._id}>
              <td>{app.petName}</td>
              <td>{app.ownerName}</td>
              <td>{new Date(app.date).toLocaleDateString()}</td>
              <td>{app.time}</td>
              <td>{app.serviceType}</td>
              <td>{app.status}</td>
              <td>
                {app.status === 'scheduled' && (
                  <>
                    <button onClick={() => handleAccept(app._id)}>Accept</button>
                    <button onClick={() => handleReject(app._id)}>Reject</button>
                  </>
                )}
                {app.status === 'confirmed' && <span>Confirmed ✅</span>}
                {app.status === 'cancelled' && <span>Cancelled ❌</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Footer/>
    </>
  );
};

export default VetAppointments;
