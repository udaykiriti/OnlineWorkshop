import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiredRole }) => {
  const isAuthenticated = localStorage.getItem("username") !== null;
  const userRole = localStorage.getItem("role"); 
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/login" />;
  }
  return element;
};
export default ProtectedRoute;
