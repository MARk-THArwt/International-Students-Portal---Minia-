import {
  IconLayoutDashboard,
  IconFileText,
  IconTools,
  IconCalendar,
  IconCreditCard,
  IconUser,
} from "@tabler/icons-react";
export const dashboardLinks = {
  admin: [
    { label: "Dashboard", path: "/dashboard/admin" },
    { label: "Users", path: "/dashboard/admin/users" },
    { label: "Reports", path: "/dashboard/admin/reports" },
  ],
  student: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: IconLayoutDashboard,
      route: "/dashboard",
    },
    {
      id: "requests",
      label: "My Requests",
      icon: IconFileText,
      route: "/requests",
    },
    { id: "services", label: "Services", icon: IconTools, route: "/services" },
    {
      id: "Events",
      label: "Events",
      icon: IconCalendar,
      route: "/events",
    },
    {
      id: "fees",
      label: "Fees & Payments",
      icon: IconCreditCard,
      route: "/fees",
    },
    { id: "profile", label: "Profile", icon: IconUser, route: "/profile" },
  ],
  staff: [
    { label: "Dashboard", path: "/dashboard/staff" },
    { label: "طلبات", path: "/dashboard/staff/requests" },
  ],
};