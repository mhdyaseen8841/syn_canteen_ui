import React from 'react';
import { Navigate } from 'react-router-dom';
import { Roles } from './Pages'; // ✅ Import your roles

export default function ProtectedRoute({ element, allowedRoles }) {
  const role = localStorage.getItem('role');

  // If not logged in → go to login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // If role not allowed → go to unauthorized page
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element; // ✅ Allow access
}
