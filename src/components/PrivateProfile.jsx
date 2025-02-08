import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const PrivateProfile = ({ children }) => {
  const { isAuthorized, loading } = useAuth();

  if (loading) {
    return <p style={{ textAlign: "center" }}>waiting..</p>;
  }

  // If not authorized, redirect to dashboard
  if (!isAuthorized) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateProfile;
