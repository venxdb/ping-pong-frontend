import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, organizerOnly = false }) => {
  const { user, userDetails } = useAuth();

  // Se non è loggato, reindirizza al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se richiede di essere organizzatore ma non lo è
  if (organizerOnly && userDetails && !userDetails.organizzatore_del_torneo) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;