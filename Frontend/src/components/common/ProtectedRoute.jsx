import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../../utils/auth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if specific role is required
  if (requiredRole) {
    const userRole = getUserRole();
    
    // If admin role is required but user is not admin, redirect to user page
    if (requiredRole === 'admin' && userRole !== 'admin') {
      return <Navigate to="/user" replace />;
    }
    
    // If user role is required but user is admin, allow access (admin can access user pages)
    if (requiredRole === 'user' && userRole !== 'user' && userRole !== 'admin') {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
