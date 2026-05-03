import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  IconLayoutDashboard,
  IconLogout,
} from "@tabler/icons-react";

import Logo from "@/assets/Minya University Logo.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks/hook";
import { logout, selectUser } from "@/store/slices/authSlice";
import {dashboardLinks} from "./../../component/DashbordComp/dashboardLinks"


export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  // Helper to determine the correct dashboard route based on role
  const getDashboardRoute = () => {
    if (user?.role === "admin") return "/dashboard/admin";
    if (user?.role === "staff") return "/staff-dashboard";
    return "/dashboard";
  };
  // Fallback to "student" if user.role is undefined or not in dashboardLinks
  const role = (user?.role as keyof typeof dashboardLinks) || "student";
  const menuItems = dashboardLinks[role] || dashboardLinks.student;
  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/Login");
  };

  return (
    <Sidebar className="bg-[#0A1931] text-white flex flex-col h-screen px-1 py-3">
      {/* HEADER */}
      <SidebarHeader className="border-b border-white/10">
        <div className="flex gap-3 items-center">
          <Link to="/">
            <img
              src={Logo}
              className="w-12 h-12 rounded-full"
              alt="Minia University logo"
            />
          </Link>
          <div>
            <h1 className="m-0 text-lg font-bold">Minia University</h1>
            <p className="m-0 text-xs font-medium">
              International Students Portal
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => {
                // Cast item to any to handle different structures in dashboardLinks (e.g. `path` vs `route`)
                const typedItem = item as any;
                const Icon = typedItem.icon || IconLayoutDashboard; // fallback icon
                const itemRoute = typedItem.route || typedItem.path || "#";
                const itemId = typedItem.id || `item-${index}`;
                
                const route = itemId === "dashboard" ? getDashboardRoute() : itemRoute;
                const isActive = location.pathname === route || (itemId === "dashboard" && location.pathname.startsWith(route));

                return (
                  <SidebarMenuItem key={itemId}>
                    <SidebarMenuButton
                      onClick={() => navigate(route)}
                      className={`flex items-center gap-3 h-11 px-4 rounded-lg transition cursor-pointer
                        ${
                          isActive
                            ? "bg-white/10 border-l-4 border-[#C5A059]"
                            : "hover:bg-white/5"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{typedItem.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="mt-auto p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 
          bg-white/10 hover:bg-white/20 
          text-white text-sm font-medium 
          rounded-lg py-3 transition cursor-pointer"
        >
          <IconLogout className="w-4 h-4" />
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
