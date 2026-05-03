import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks/hook";
import { selectUser } from "../../store/slices/authSlice";

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAppSelector(selectUser);

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
