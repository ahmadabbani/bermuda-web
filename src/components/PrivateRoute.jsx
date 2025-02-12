import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import LoaderLight from "./LoaderLight";

const PrivateRoute = ({ children }) => {
  const { isAuthorized, user, loading } = useAuth();

  if (loading) {
    return <p style={{ textAlign: "center" }}>waiting..</p>;
  }

  // If not authorized, redirect to dashboard
  if (!isAuthorized) {
    return <Navigate to="/" />;
  }

  // If authorized but not an admin, redirect to dashboard
  if (user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  // If authorized and role is admin, allow access
  return children;
};

export default PrivateRoute;
