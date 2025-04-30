import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import VetNavBar from '../../components/Veterinarian/VetNavBar';
import Footer from '../../components/Footer';
import '../../css/Veterinarian/vetappointments.css';

const VetAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Report generation states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTimePeriod, setReportTimePeriod] = useState('all');
  const [reportStatusFilter, setReportStatusFilter] = useState('all');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

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

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter appointments by time period
  const filterAppointmentsByTimePeriod = (appointments, timePeriod) => {
    if (timePeriod === 'all') {
      return appointments;
    }

    const now = new Date();
    const monthsToSubtract = timePeriod === 'last-month' ? 1 : 3;
    const startDate = new Date(now.setMonth(now.getMonth() - monthsToSubtract));
    
    return appointments.filter(app => new Date(app.date) >= startDate);
  };

  // Filter appointments by status
  const filterAppointmentsByStatus = (appointments, statusFilter) => {
    if (statusFilter === 'all') {
      return appointments;
    }
    return appointments.filter(app => app.status === statusFilter);
  };

  // Generate and download PDF report
  const generateReport = () => {
    setIsGeneratingReport(true);

    try {
      // Filter appointments based on selected criteria
      let filteredApps = [...appointments];
      filteredApps = filterAppointmentsByTimePeriod(filteredApps, reportTimePeriod);
      filteredApps = filterAppointmentsByStatus(filteredApps, reportStatusFilter);

      // Create PDF document
      const doc = new jsPDF();
      
      // Add logo
      // Note: You'll need to replace this with your actual logo URL
      const logoUrl = '/path/to/your/logo.png'; // Update this with your logo path
      try {
        doc.addImage(logoUrl, 'PNG', 15, 10, 30, 30);
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
        // Continue without logo if it fails
      }

      // Add title and date
      doc.setFontSize(18);
      doc.text('Pet Health Care System - Appointment Report', 50, 20);
      
      // Add report details
      doc.setFontSize(12);
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      doc.text(`Generated on: ${today}`, 15, 50);
      
      // Add time period information
      let timePeriodText = 'All time';
      if (reportTimePeriod === 'last-month') {
        timePeriodText = 'Last month';
      } else if (reportTimePeriod === 'last-3-months') {
        timePeriodText = 'Last 3 months';
      }
      
      doc.text(`Time period: ${timePeriodText}`, 15, 60);
      
      // Add status filter information
      let statusText = 'All statuses';
      if (reportStatusFilter !== 'all') {
        statusText = reportStatusFilter.charAt(0).toUpperCase() + reportStatusFilter.slice(1);
      }
      
      doc.text(`Status filter: ${statusText}`, 15, 70);
      doc.text(`Total appointments: ${filteredApps.length}`, 15, 80);
      
      // Add appointment table
      const tableColumn = [
        'Pet Name', 
        'Owner', 
        'Date', 
        'Time',
        'Service', 
        'Status'
      ];
      
      const tableRows = filteredApps.map(app => [
        app.petName,
        app.ownerName,
        formatDate(app.date),
        app.time,
        app.serviceType,
        app.status.charAt(0).toUpperCase() + app.status.slice(1)
      ]);
      
      doc.autoTable({
        startY: 90,
        head: [tableColumn],
        body: tableRows,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        rowStyles: {
          fontSize: 10
        }
      });
      
      // Add summary information
      const summaryY = doc.lastAutoTable.finalY + 20;
      
      // Count appointments by status
      const statusCounts = {
        scheduled: filteredApps.filter(app => app.status === 'scheduled').length,
        confirmed: filteredApps.filter(app => app.status === 'confirmed').length,
        completed: filteredApps.filter(app => app.status === 'completed').length,
        cancelled: filteredApps.filter(app => app.status === 'cancelled').length
      };
      
      doc.text('Appointment Summary:', 15, summaryY);
      doc.text(`Scheduled: ${statusCounts.scheduled}`, 15, summaryY + 10);
      doc.text(`Confirmed: ${statusCounts.confirmed}`, 15, summaryY + 20);
      doc.text(`Completed: ${statusCounts.completed}`, 15, summaryY + 30);
      doc.text(`Cancelled: ${statusCounts.cancelled}`, 15, summaryY + 40);
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text('Pet Health Care System - Confidential', 15, doc.internal.pageSize.height - 10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
      
      // Save the PDF
      const statusText2 = reportStatusFilter === 'all' ? 'all-status' : reportStatusFilter;
      const timeText = reportTimePeriod === 'all' ? 'all-time' : reportTimePeriod;
      doc.save(`appointment-report-${statusText2}-${timeText}-${today}.pdf`);
      
      toast.success('Report generated successfully');
      setShowReportModal(false);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(app => app.status === filter);

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
          
          <div className="vet-viewappointment-action-buttons">
            <button 
              className="vet-viewappointment-report-btn"
              onClick={() => setShowReportModal(true)}
            >
              <i className="fas fa-file-pdf"></i> Generate Report
            </button>
            
            <button 
              className="vet-viewappointment-refresh-btn"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
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

        {/* Report Generation Modal */}
        {showReportModal && (
          <div className="vet-report-modal-overlay">
            <div className="vet-report-modal">
              <div className="vet-report-modal-header">
                <h2>Generate Appointment Report</h2>
                <button 
                  className="vet-report-modal-close"
                  onClick={() => setShowReportModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="vet-report-modal-body">
                <div className="vet-report-form-group">
                  <label>Time Period:</label>
                  <select
                    value={reportTimePeriod}
                    onChange={(e) => setReportTimePeriod(e.target.value)}
                    className="vet-report-select"
                  >
                    <option value="all">All Time</option>
                    <option value="last-month">Last Month</option>
                    <option value="last-3-months">Last 3 Months</option>
                  </select>
                </div>
                
                <div className="vet-report-form-group">
                  <label>Status Filter:</label>
                  <select
                    value={reportStatusFilter}
                    onChange={(e) => setReportStatusFilter(e.target.value)}
                    className="vet-report-select"
                  >
                    <option value="all">All Statuses</option>
                    <option value="scheduled">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="vet-report-preview">
                  <h3>Report Preview</h3>
                  <p>
                    <strong>Time Period:</strong> {reportTimePeriod === 'all' ? 'All Time' : reportTimePeriod === 'last-month' ? 'Last Month' : 'Last 3 Months'}
                  </p>
                  <p>
                    <strong>Status Filter:</strong> {reportStatusFilter === 'all' ? 'All Statuses' : reportStatusFilter.charAt(0).toUpperCase() + reportStatusFilter.slice(1)}
                  </p>
                  
                  {/* Preview count of appointments that will be in the report */}
                  {(() => {
                    let count = appointments.length;
                    
                    if (reportTimePeriod !== 'all') {
                      const now = new Date();
                      const monthsToSubtract = reportTimePeriod === 'last-month' ? 1 : 3;
                      const startDate = new Date(now.setMonth(now.getMonth() - monthsToSubtract));
                      count = appointments.filter(app => new Date(app.date) >= startDate).length;
                    }
                    
                    if (reportStatusFilter !== 'all') {
                      count = appointments.filter(app => app.status === reportStatusFilter).length;
                    }
                    
                    if (reportTimePeriod !== 'all' && reportStatusFilter !== 'all') {
                      const now = new Date();
                      const monthsToSubtract = reportTimePeriod === 'last-month' ? 1 : 3;
                      const startDate = new Date(now.setMonth(now.getMonth() - monthsToSubtract));
                      count = appointments.filter(app => 
                        new Date(app.date) >= startDate && app.status === reportStatusFilter
                      ).length;
                    }
                    
                    return <p><strong>Total Appointments in Report:</strong> {count}</p>;
                  })()}
                </div>
              </div>
              
              <div className="vet-report-modal-footer">
                <button 
                  className="vet-report-modal-cancel"
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="vet-report-modal-generate"
                  onClick={generateReport}
                  disabled={isGeneratingReport}
                >
                  {isGeneratingReport ? 'Generating...' : 'Generate PDF Report'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default VetAppointments;