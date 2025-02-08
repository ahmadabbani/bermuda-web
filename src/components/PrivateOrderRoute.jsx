import React from "react";
import { Navigate } from "react-router-dom";

const PrivateOrderRoute = ({ children, isAuthorized }) => {
  // Allow access if authorized user
  if (isAuthorized) {
    return children;
  }

  // Redirect to dashboard if unauthorized
  return <Navigate to="/signin" />;
};

export default PrivateOrderRoute;
