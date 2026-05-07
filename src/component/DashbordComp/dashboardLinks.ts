import {
  IconLayoutDashboard,
  IconTools,
  IconCalendar,
  IconFileText,
  IconUser,
} from "@tabler/icons-react";

export const dashboardLinks = {
  admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: IconLayoutDashboard,
      route: "/dashboard/admin",
    },
    {
      id: "users",
      label: "Users",
      icon: IconUser,
      route: "/users",
    },
    {
      id: "reports",
      label: "Reports",
      icon: IconFileText,
      route: "/dashboard/admin/reports",
    },
    {
      id: "Events",
      label: "Events",
      icon: IconCalendar,
      route: "/events",
    },
    {
      id: "services-management",
      label: "Services Management",
      icon: IconTools,
      route: "/services-management",
    },
  ],

  student: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: IconLayoutDashboard,
      route: "/dashboard",
    },
    {
      id: "services",
      label: "Services",
      icon: IconTools,
      route: "/services",
      subLinks: [],
    },
    {
      id: "Events",
      label: "Events",
      icon: IconCalendar,
      route: "/events",
    },
    {
      id: "Contact",
      label: "Contact us",
      icon: IconCalendar,
      route: "/Contact",
    },
   
    { id: "profile", label: "Profile", icon: IconUser, route: "/profile" },
  ],
  staff: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: IconLayoutDashboard,
      route: "/dashboard/staff",
    },
    {
      id: "Contact",
      label: "Contact us",
      icon: IconCalendar,
      route: "/Contact",
    },
  ],
};
