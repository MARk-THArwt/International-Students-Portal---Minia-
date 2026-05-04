import {
  IconLayoutDashboard,
  IconTools,
  IconCalendar,
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
    { id: "services", label: "Services", icon: IconTools, route: "/services" },
    {
      id: "Events",
      label: "Events",
      icon: IconCalendar,
      route: "/events",
    },
   
    { id: "profile", label: "Profile", icon: IconUser, route: "/profile" },
  ],
  staff: [
    { label: "Dashboard", path: "/dashboard/staff" },
    ,
  ],
};