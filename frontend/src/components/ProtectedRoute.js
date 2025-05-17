import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Simulate authentication status (replace with actual auth logic later)
const isAuthenticated = () => {
  // For now, let's assume the user is authenticated if a token exists in localStorage
  // In a real app, you would verify the token with a backend or use a state management solution
  return localStorage.getItem('authToken') !== null; // Returning true for now for easier testing, will be false
};

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 