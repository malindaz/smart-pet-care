import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredLevel }) => {
    const { isAuthenticated, loading, currentUser } = useAuth();
    
    if (loading) {
        return <div className="loading_container">Loading...</div>;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // If requiredLevel is specified, check if user has required level
    if (requiredLevel !== undefined && currentUser.userLevel > requiredLevel) {
        return <Navigate to="/unauthorized" replace />;
    }
    
    return <Outlet />;
};

export default ProtectedRoute;