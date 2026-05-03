import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks/hook";
import { selectUser } from "../../store/slices/authSlice";

import { StudentDashboard } from "./StudentDashboard";

export function DashboardSwitcher() {
  const user = useAppSelector(selectUser);
  // 1. If not logged in, redirect to Login
  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  // 2. Redirect staff to their specific URL
  if (user.role === "admin") {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (user.role === "staff") {
    return <Navigate to="/staff-dashboard" replace />;
  }

  // 3. Otherwise, render the Student Dashboard
  return <StudentDashboard />;
}
