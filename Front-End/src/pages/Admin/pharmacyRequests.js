import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../css/Admin/PharmacyRequests.css';
import AdminNavBar from '../../components/Admin/AdminNavBar';
import Footer from '../../components/Footer';

const PharmacyRequests = () => {
  const [pharmacyRequests, setPharmacyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchPharmacyRequests = async () => {
      try {
        setLoading(true);
        // Add authorization header if required
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const response = await axios.get(
          'http://localhost:5000/api/admin/pharmacy-requests',
          config
        );
        
        setPharmacyRequests(response.data.data);
      } catch (error) {
        console.error('Error fetching pharmacy requests:', error);
        toast.error('Failed to load pharmacy requests');
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacyRequests();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setProcessingId(id);
    
    try {
      const response = await axios.put(
        'http://localhost:5000/api/admin/update-pharmacy-status',
        { id, status }
      );
      
      if (response.data.success) {
        setPharmacyRequests(pharmacyRequests.map(request => 
          request._id === id ? { ...request, status } : request
        ));
        
        toast.success(`Pharmacy request ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
        
        if (status === 'approved') {
          toast.info('User level updated to Pharmacy (Level 3)');
        }
      } else {
        throw new Error(response.data.error || 'Failed to update request');
      }
    } catch (error) {
      console.error('Error updating pharmacy status:', error);
      toast.error(`Failed to update status: ${error.response?.data?.error || error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

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
      <div className="admin-pharmacyrequests-loading">
        <div className="admin-pharmacyrequests-spinner"></div>
        <p>Loading pharmacy requests...</p>
      </div>
    );
  }

  return (
    <>
      <AdminNavBar />
      <div className="admin-pharmacyrequests-container">
        <h1 className="admin-pharmacyrequests-title">Pharmacy Applications</h1>

        {pharmacyRequests.length === 0 ? (
          <div className="admin-pharmacyrequests-empty">
            <p>No pharmacy applications found.</p>
          </div>
        ) : (
          <>
            <div className="admin-pharmacyrequests-stats">
              <div className="admin-pharmacyrequests-stat">
                <span className="admin-pharmacyrequests-stat-number">
                  {pharmacyRequests.length}
                </span>
                <span className="admin-pharmacyrequests-stat-label">Total</span>
              </div>
              <div className="admin-pharmacyrequests-stat">
                <span className="admin-pharmacyrequests-stat-number">
                  {pharmacyRequests.filter(req => req.status === 'pending').length}
                </span>
                <span className="admin-pharmacyrequests-stat-label">Pending</span>
              </div>
              <div className="admin-pharmacyrequests-stat">
                <span className="admin-pharmacyrequests-stat-number">
                  {pharmacyRequests.filter(req => req.status === 'approved').length}
                </span>
                <span className="admin-pharmacyrequests-stat-label">Approved</span>
              </div>
              <div className="admin-pharmacyrequests-stat">
                <span className="admin-pharmacyrequests-stat-number">
                  {pharmacyRequests.filter(req => req.status === 'rejected').length}
                </span>
                <span className="admin-pharmacyrequests-stat-label">Rejected</span>
              </div>
            </div>

            <div className="admin-pharmacyrequests-list">
              {pharmacyRequests.map((request) => (
                <div 
                  key={request._id} 
                  className={`admin-pharmacyrequests-card ${
                    request.status !== 'pending' ? `admin-pharmacyrequests-${request.status}` : ''
                  }`}
                >
                  <div className="admin-pharmacyrequests-card-header">
                    <div className="admin-pharmacyrequests-pharmacy-info">
                      <div className="admin-pharmacyrequests-profile-image">
                        {request.profileImage ? (
                          <img 
                            src={`http://localhost:5000/${request.profileImage}`}
                            alt={request.pharmacyName}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/60?text=No+Image';
                            }}
                          />
                        ) : (
                          <img 
                            src="https://via.placeholder.com/60?text=No+Image"
                            alt={request.pharmacyName}
                          />
                        )}
                      </div>
                      <div className="admin-pharmacyrequests-pharmacy-details">
                        <h3>{request.pharmacyName}</h3>
                        <p>{request.ownerFirstName} {request.ownerLastName} • Owner</p>
                        <p>{request.city}, {request.state}</p>
                      </div>
                    </div>
                    <div className="admin-pharmacyrequests-status-badge">
                      <span className={`admin-pharmacyrequests-status admin-pharmacyrequests-status-${request.status}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <span className="admin-pharmacyrequests-date">
                        Applied on {formatDate(request.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="admin-pharmacyrequests-card-actions">
                    <button 
                      className="admin-pharmacyrequests-toggle-btn"
                      onClick={() => toggleExpand(request._id)}
                    >
                      {expandedRequest === request._id ? 'Hide Details' : 'View Details'}
                    </button>

                    {request.status === 'pending' && (
                      <div className="admin-pharmacyrequests-action-buttons">
                        <button 
                          className="admin-pharmacyrequests-approve-btn"
                          disabled={processingId === request._id}
                          onClick={() => handleStatusUpdate(request._id, 'approved')}
                        >
                          {processingId === request._id ? 'Processing...' : 'Approve'}
                        </button>
                        <button 
                          className="admin-pharmacyrequests-reject-btn"
                          disabled={processingId === request._id}
                          onClick={() => handleStatusUpdate(request._id, 'rejected')}
                        >
                          {processingId === request._id ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </div>

                  {expandedRequest === request._id && (
                    <div className="admin-pharmacyrequests-details">
                      {/* Contact Information */}
                      <div className="admin-pharmacyrequests-details-section">
                        <h4>Contact Information</h4>
                        <div className="admin-pharmacyrequests-details-grid">
                          <div><strong>Email:</strong> {request.email}</div>
                          <div><strong>Phone:</strong> {request.phone}</div>
                        </div>
                      </div>

                      {/* License Information */}
                      <div className="admin-pharmacyrequests-details-section">
                        <h4>License Information</h4>
                        <div className="admin-pharmacyrequests-details-grid">
                          <div>
                            <strong>License #:</strong> {request.pharmacyLicenseNumber}
                          </div>
                          <div>
                            <strong>Issuing Authority:</strong> {request.licenseIssuingAuthority}
                          </div>
                          <div>
                            <strong>Expiry Date:</strong> {formatDate(request.licenseExpiryDate)}
                          </div>
                        </div>
                      </div>

                      {/* Operating Hours */}
                      <div className="admin-pharmacyrequests-details-section">
                        <h4>Operating Hours</h4>
                        <div className="admin-pharmacyrequests-details-grid">
                          {Object.entries(request.operatingHours).map(([day, hours]) => (
                            <div key={day}>
                              <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>
                              {` ${hours.open} - ${hours.close}`}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Services */}
                      <div className="admin-pharmacyrequests-details-section">
                        <h4>Services</h4>
                        <div className="admin-pharmacyrequests-details-grid">
                          <div>
                            <strong>Specialized Services:</strong>
                            <div className="admin-pharmacyrequests-services-list">
                              {request.specializedServices.map((service, index) => (
                                <span key={index} className="admin-pharmacyrequests-service-tag">
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <strong>Additional Services:</strong>
                            <ul className="admin-pharmacyrequests-services-checklist">
                              <li className={request.deliveryAvailable ? 'available' : ''}>
                                Delivery Service
                              </li>
                              <li className={request.onlineOrderingAvailable ? 'available' : ''}>
                                Online Ordering
                              </li>
                              <li className={request.emergencyServices ? 'available' : ''}>
                                Emergency Services
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="admin-pharmacyrequests-details-section">
                        <h4>Documents</h4>
                        <div className="admin-pharmacyrequests-documents">
                          <a 
                            href={`http://localhost:5000/${request.businessRegistrationDocument}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-pharmacyrequests-document-link"
                          >
                            View Business Registration
                          </a>
                          <a 
                            href={`http://localhost:5000/${request.pharmacyLicenseDocument}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-pharmacyrequests-document-link"
                          >
                            View Pharmacy License
                          </a>
                        </div>
                      </div>

                      {/* Description */}
                      {request.description && (
                        <div className="admin-pharmacyrequests-details-section">
                          <h4>Description</h4>
                          <div className="admin-pharmacyrequests-bio">
                            <p>{request.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PharmacyRequests;