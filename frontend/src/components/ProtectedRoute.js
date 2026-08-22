import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Restricts unauthenticated access and enforces role-based permissions.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();

  // 1. If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If route is marked adminOnly and current user is not an admin, redirect to home
  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // 3. User is authorized, render the requested child component
  return children;
};

export default ProtectedRoute;