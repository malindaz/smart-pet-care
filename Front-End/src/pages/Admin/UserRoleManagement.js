import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminNavBar from '../../components/Admin/AdminNavBar';
import Footer from '../../components/Footer';
import '../../css/Admin/UserRoleManagement.css';
import { FaSearch } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const UserRoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  const userLevels = {
    1: 'Admin',
    2: 'Veterinarian',
    3: 'Pharmacy',
    4: 'User'
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newLevel) => {
    try {
      setProcessingId(userId);
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { userLevel: parseInt(newLevel) },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, userLevel: parseInt(newLevel) } : user
      ));
      
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setProcessingId(userId);
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phoneNumber.toLowerCase().includes(searchLower)
    );
    
    if (!selectedRole) return matchesSearch;
    
    return matchesSearch && user.userLevel === parseInt(selectedRole);
  });

  const handleStatCardClick = (role) => {
    setSelectedRole(selectedRole === role ? null : role);
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('User Role Management Report', 14, 20);
    
    // Add timestamp
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Add statistics
    doc.setFontSize(12);
    doc.text('User Statistics:', 14, 40);
    const stats = Object.entries(userLevels).map(([level, label]) => [
      `${label}s:`,
      users.filter(user => user.userLevel === parseInt(level)).length.toString()
    ]);
    stats.unshift(['Total Users:', users.length.toString()]);
    
    autoTable(doc, {
      startY: 45,
      head: [['Category', 'Count']],
      body: stats,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14 },
      tableWidth: 80
    });
    
    // Add users table
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Name', 'Username', 'Email', 'Phone', 'Role']],
      body: filteredUsers.map(user => [
        `${user.firstName} ${user.lastName}`,
        user.username,
        user.email,
        user.phoneNumber,
        userLevels[user.userLevel]
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 },
      margin: { left: 14 }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        'Pet Health Care System - User Management Report',
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 25,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Save the PDF
    doc.save(`user-management-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return <div className="UserRoleManagement-loading">Loading...</div>;
  }

  return (
    <>
      <AdminNavBar />
      <div className="UserRoleManagement-container">
        <div className="UserRoleManagement-header">
          <h1 className="UserRoleManagement-title">User Role Management</h1>
          <div className="UserRoleManagement-search-container">
            <div className="UserRoleManagement-search-wrapper">
              <FaSearch className="UserRoleManagement-search-icon" />
              <input
                type="text"
                placeholder="Search by name, username, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="UserRoleManagement-search-input"
              />
              {searchTerm && (
                <button 
                  className="UserRoleManagement-clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <button 
            className="UserRoleManagement-download-btn"
            onClick={generatePDFReport}
          >
            Download PDF Report
          </button>
        </div>
        
        <div className="UserRoleManagement-stats">
          <div 
            className={`UserRoleManagement-stat-card ${!selectedRole ? 'UserRoleManagement-active' : ''}`}
            onClick={() => handleStatCardClick(null)}
            role="button"
            tabIndex={0}
          >
            <span className="UserRoleManagement-stat-number">{users.length}</span>
            <span className="UserRoleManagement-stat-label">Total Users</span>
          </div>
          {Object.entries(userLevels).map(([level, label]) => (
            <div
              key={level}
              className={`UserRoleManagement-stat-card ${selectedRole === level ? 'UserRoleManagement-active' : ''}`}
              onClick={() => handleStatCardClick(level)}
              role="button"
              tabIndex={0}
            >
              <span className="UserRoleManagement-stat-number">
                {users.filter(user => user.userLevel === parseInt(level)).length}
              </span>
              <span className="UserRoleManagement-stat-label">{label}s</span>
            </div>
          ))}
        </div>

        <div className="UserRoleManagement-users-table-container">
          {filteredUsers.length === 0 ? (
            <div className="UserRoleManagement-no-results">
              No users found matching your search criteria
            </div>
          ) : (
            <table className="UserRoleManagement-users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Current Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <select
                        value={user.userLevel}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={processingId === user._id}
                        className="UserRoleManagement-role-select"
                      >
                        {Object.entries(userLevels).map(([level, label]) => (
                          <option key={level} value={level}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={processingId === user._id}
                        className="UserRoleManagement-delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer/> 
    </>
  );
};

export default UserRoleManagement;