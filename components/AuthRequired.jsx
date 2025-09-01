import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthRequired() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          message: "You must log in first",
          from: location.pathname,
        }}
        replace
      />
    );
  }

  return <Outlet />;
}
