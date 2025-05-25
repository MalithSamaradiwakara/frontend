import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Component to protect routes that need admin authentication
const ProtectedAdminRoute = () => {
  const userType = localStorage.getItem('userType');
  
  // Check if the user is logged in and is an admin
  if (!userType || userType !== 'Admin') {
    // Redirect to login page if not authenticated or not an admin
    return <Navigate to="/login" replace />;
  }

  // Render the child routes if authenticated as admin
  return <Outlet />;
};

export default ProtectedAdminRoute;