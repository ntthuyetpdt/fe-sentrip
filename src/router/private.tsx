import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();

  const profileString = localStorage.getItem("user_profile");
  const profile = profileString ? JSON.parse(profileString) : null;

  const allowRoles = ["ADMIN", "EMPLOYEE", "SUPPLIER", "ACCOUNTANT"];

  if (!profile) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (!allowRoles.includes(profile.role)) {

    if (location.pathname === "/") {
      return <>{children}</>;
    }

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;