// src/pages/admin/VetRequests.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../css/Admin/VetRequests.css';
import AdminNavBar from '../../components/Admin/AdminNavBar';
import Footer from '../../components/Footer';

const VetRequests = () => {
  const [vetRequests, setVetRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Fetch all vet requests
  useEffect(() => {
    const fetchVetRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:5000/api/admin/requests', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setVetRequests(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching veterinarian requests:', error);
        toast.error('Failed to load veterinarian requests');
        setLoading(false);
      }
    };

    fetchVetRequests();
  }, []);


const handleStatusUpdate = async (id, status) => {
  setProcessingId(id);
  
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.put(
      'http://localhost:5000/api/admin/update-status',
      { id, status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (response.data.success) {
      // Update the local state
      setVetRequests(vetRequests.map(request => 
        request._id === id ? { ...request, status } : request
      ));
      
      toast.success(`Veterinarian request ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      
      if (status === 'approved') {
        toast.info('User level updated to Veterinarian (Level 2)');
      }
    } else {
      throw new Error(response.data.error || 'Failed to update request');
    }
    
  } catch (error) {
    console.error('Error updating veterinarian status:', error);
    toast.error(`Failed to update status: ${error.response?.data?.error || error.message}`);
  } finally {
    setProcessingId(null);
  }
};

  // Toggle expanded view
  const toggleExpand = (id) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="admin-vetrequests-loading">
        <div className="admin-vetrequests-spinner"></div>
        <p>Loading veterinarian requests...</p>
      </div>
    );
  }

  return (
    <>
    <AdminNavBar/>
    <div className="admin-vetrequests-container">
      <h1 className="admin-vetrequests-title">Veterinarian Applications</h1>
      
      {vetRequests.length === 0 ? (
        <div className="admin-vetrequests-empty">
          <p>No veterinarian applications found.</p>
        </div>
      ) : (
        <>
          <div className="admin-vetrequests-stats">
            <div className="admin-vetrequests-stat">
              <span className="admin-vetrequests-stat-number">{vetRequests.length}</span>
              <span className="admin-vetrequests-stat-label">Total</span>
            </div>
            <div className="admin-vetrequests-stat">
              <span className="admin-vetrequests-stat-number">
                {vetRequests.filter(req => req.status === 'pending').length}
              </span>
              <span className="admin-vetrequests-stat-label">Pending</span>
            </div>
            <div className="admin-vetrequests-stat">
              <span className="admin-vetrequests-stat-number">
                {vetRequests.filter(req => req.status === 'approved').length}
              </span>
              <span className="admin-vetrequests-stat-label">Approved</span>
            </div>
            <div className="admin-vetrequests-stat">
              <span className="admin-vetrequests-stat-number">
                {vetRequests.filter(req => req.status === 'rejected').length}
              </span>
              <span className="admin-vetrequests-stat-label">Rejected</span>
            </div>
          </div>

          <div className="admin-vetrequests-list">
            {vetRequests.map((request) => (
              <div 
                key={request._id} 
                className={`admin-vetrequests-card ${request.status !== 'pending' ? `admin-vetrequests-${request.status}` : ''}`}
              >
                <div className="admin-vetrequests-card-header">
                  <div className="admin-vetrequests-vet-info">
                  <div className="admin-vetrequests-profile-image">
                          {request.profileImage ? (
                            <img 
                              src={request.profileImage.startsWith('http') 
                                ? request.profileImage 
                                : `http://localhost:5000/${request.profileImage}`} 
                              alt={`${request.firstName} ${request.lastName}`} 
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = 'https://via.placeholder.com/60?text=No+Image';
                              }}
                            />
                          ) : (
                            <img 
                              src="https://via.placeholder.com/60?text=No+Image" 
                              alt={`${request.firstName} ${request.lastName}`} 
                            />
                          )}
                        </div>
                    <div className="admin-vetrequests-vet-details">
                      <h3>{request.firstName} {request.lastName}</h3>
                      <p>{request.specialization} • {request.yearsOfExperience} years exp.</p>
                      <p>{request.clinicName}, {request.city}, {request.state}</p>
                    </div>
                  </div>
                  <div className="admin-vetrequests-status-badge">
                    <span className={`admin-vetrequests-status admin-vetrequests-status-${request.status}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    <span className="admin-vetrequests-date">Applied on {formatDate(request.createdAt)}</span>
                  </div>
                </div>
                
                <div className="admin-vetrequests-card-actions">
                  <button 
                    className="admin-vetrequests-toggle-btn"
                    onClick={() => toggleExpand(request._id)}
                  >
                    {expandedRequest === request._id ? 'Hide Details' : 'View Details'}
                  </button>
                  
                  {request.status === 'pending' && (
                    <div className="admin-vetrequests-action-buttons">
                      <button 
                        className="admin-vetrequests-approve-btn"
                        disabled={processingId === request._id}
                        onClick={() => handleStatusUpdate(request._id, 'approved')}
                      >
                        {processingId === request._id ? 'Processing...' : 'Approve'}
                      </button>
                      <button 
                        className="admin-vetrequests-reject-btn"
                        disabled={processingId === request._id}
                        onClick={() => handleStatusUpdate(request._id, 'rejected')}
                      >
                        {processingId === request._id ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  )}
                </div>
                
                {expandedRequest === request._id && (
                  <div className="admin-vetrequests-details">
                    <div className="admin-vetrequests-details-section">
                      <h4>Contact Information</h4>
                      <div className="admin-vetrequests-details-grid">
                        <div>
                          <strong>Email:</strong> {request.email}
                        </div>
                        <div>
                          <strong>Phone:</strong> {request.phone}
                        </div>
                      </div>
                    </div>
                    
                    <div className="admin-vetrequests-details-section">
                      <h4>Professional Credentials</h4>
                      <div className="admin-vetrequests-details-grid">
                        <div>
                          <strong>License #:</strong> {request.licenseNumber}
                        </div>
                        <div>
                          <strong>Issuing Authority:</strong> {request.licenseIssuingAuthority}
                        </div>
                        <div>
                          <strong>Expiry Date:</strong> {formatDate(request.licenseExpiryDate)}
                        </div>
                        <div>
                          <strong>License Document:</strong> 
                          <a href={request.licenseCopy} target="_blank" rel="noopener noreferrer" className="admin-vetrequests-document-link">
                            View License
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="admin-vetrequests-details-section">
                      <h4>Education</h4>
                      <div className="admin-vetrequests-education-list">
                        {request.education.map((edu, index) => (
                          <div key={index} className="admin-vetrequests-education-item">
                            <strong>{edu.degree}</strong>
                            <p>{edu.institution}, {edu.yearCompleted}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {request.additionalCertifications && request.additionalCertifications.length > 0 && (
                      <div className="admin-vetrequests-details-section">
                        <h4>Additional Certifications</h4>
                        <div className="admin-vetrequests-certification-list">
                          {request.additionalCertifications.map((cert, index) => (
                            <div key={index} className="admin-vetrequests-certification-item">
                              <strong>{cert.name}</strong>
                              <p>{cert.issuingBody}, {cert.year}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="admin-vetrequests-details-section">
                      <h4>Practice Details</h4>
                      <div className="admin-vetrequests-details-grid">
                        <div>
                          <strong>Clinic Name:</strong> {request.clinicName}
                        </div>
                        <div>
                          <strong>Address:</strong> {request.clinicAddress}, {request.city}, {request.state} {request.zipCode}
                        </div>
                      </div>
                    </div>
                    
                    <div className="admin-vetrequests-details-section">
                      <h4>Availability</h4>
                      <div className="admin-vetrequests-availability">
                        <div>
                          <strong>Days:</strong> {request.availableDays.join(', ')}
                        </div>
                        <div>
                          <strong>Hours:</strong> {request.availableTimeStart} - {request.availableTimeEnd}
                        </div>
                        <div>
                          <strong>Emergency Services:</strong> {request.emergencyServices ? 'Yes' : 'No'}
                        </div>
                        <div>
                          <strong>Home Visits:</strong> {request.homeVisits ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="admin-vetrequests-details-section">
                      <h4>Bio</h4>
                      <div className="admin-vetrequests-bio">
                        <p>{request.bio}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default VetRequests;