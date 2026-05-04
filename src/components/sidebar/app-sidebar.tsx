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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import {
  IconChevronDown,
  IconLayoutDashboard,
  IconLogout,
} from "@tabler/icons-react";

import Logo from "@/assets/Minya University Logo.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks/hook";
import { logout, selectUser } from "@/store/slices/authSlice";
import { dashboardLinks } from "./../../component/DashbordComp/dashboardLinks";
import { useEffect, useState } from "react";
import { getServices } from "@/store/AsyncThunks/servicesThunks";
import {
  selectAllServices,
  selectFetchStatus,
} from "@/store/slices/servicesslice";

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
  const services = useAppSelector(selectAllServices);
  const servicesStatus = useAppSelector(selectFetchStatus);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  useEffect(() => {
    if (servicesStatus === "idle") {
      dispatch(getServices());
    }
  }, [servicesStatus, dispatch]);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

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
                const typedItem = item as any;
                const Icon = typedItem.icon || IconLayoutDashboard;
                const itemRoute = typedItem.route || typedItem.path || "#";
                const itemId = typedItem.id || `item-${index}`;

                const isServices = itemId === "services";
                const currentSubLinks = isServices
                  ? services.map((s) => ({
                      label: s.name,
                      route: `/newRequest?serviceId=${s._id}`,
                    }))
                  : typedItem.subLinks || [];

                const hasSubLinks = currentSubLinks.length > 0;
                const isMenuOpen = openMenus.includes(itemId);

                const route =
                  itemId === "dashboard" ? getDashboardRoute() : itemRoute;
                const isActive =
                  location.pathname === route ||
                  (itemId === "dashboard" &&
                    location.pathname.startsWith(route));

                return (
                  <SidebarMenuItem key={itemId}>
                    {hasSubLinks ? (
                      <>
                        <SidebarMenuButton
                          onClick={() => toggleMenu(itemId)}
                          className={`flex items-center justify-between w-full h-11 px-4 rounded-lg transition cursor-pointer
                            ${
                              isMenuOpen || isActive
                                ? "bg-white/10"
                                : "hover:bg-white/5"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <span className="text-sm font-medium">
                              {typedItem.label}
                            </span>
                          </div>
                          <IconChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isMenuOpen ? "rotate-180" : ""
                            }`}
                          />
                        </SidebarMenuButton>

                        {isMenuOpen && (
                          <SidebarMenuSub className="mt-1 ml-4 border-l border-white/10">
                            {servicesStatus === "loading" ? (
                              <SidebarMenuSubItem>
                                <div className="px-4 py-2 text-xs text-white/40 animate-pulse">
                                  Loading services...
                                </div>
                              </SidebarMenuSubItem>
                            ) : currentSubLinks.length > 0 ? (
                              currentSubLinks.map(
                                (subItem: any, subIndex: number) => {
                                  const isSubActive =
                                    location.pathname === subItem.route;
                                  return (
                                    <SidebarMenuSubItem key={subIndex}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={isSubActive}
                                        className={`h-9 px-4 rounded-md transition cursor-pointer ${
                                          isSubActive
                                            ? "text-[#C5A059] font-semibold"
                                            : "text-white/70 hover:text-white hover:bg-white/5"
                                        }`}
                                      >
                                        <Link to={subItem.route}>
                                          {subItem.label}
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                },
                              )
                            ) : (
                              <SidebarMenuSubItem>
                                <div className="px-4 py-2 text-xs text-white/40">
                                  No services available
                                </div>
                              </SidebarMenuSubItem>
                            )}
                          </SidebarMenuSub>
                        )}
                      </>
                    ) : (
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
                        <span className="text-sm font-medium">
                          {typedItem.label}
                        </span>
                      </SidebarMenuButton>
                    )}
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
