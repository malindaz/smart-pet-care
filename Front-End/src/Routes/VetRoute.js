import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust based on your auth context path

const VetRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Check if user is veterinarian (userLevel 2)
  if (user.userLevel !== 2) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export default VetRoute;