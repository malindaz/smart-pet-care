import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust based on your auth context path

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Check if user is admin (userLevel 1)
  if (user.userLevel !== 1) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export default AdminRoute;