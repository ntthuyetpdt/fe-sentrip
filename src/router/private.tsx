import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();

  const profileString = localStorage.getItem("user_profile");

  const profile = profileString ? JSON.parse(profileString) : null;

  if (!profile || profile.role !== "ADMIN") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  } 
  return <>{children}</>;
};

export default PrivateRoute;
