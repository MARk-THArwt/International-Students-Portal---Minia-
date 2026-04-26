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
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  IconLayoutDashboard,
  IconFileText,
  IconTools,
  IconClock,
  IconCreditCard,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import Logo from '@/assets/Minya University Logo.jpg'
import {Link} from 'react-router-dom'

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: IconLayoutDashboard, route: "/dashboard" },
  { id: "requests", label: "My Requests", icon: IconFileText, route: "/requests" },
  { id: "services", label: "Services", icon: IconTools, route: "/services" },
  { id: "schedule", label: "Class Schedule", icon: IconClock, route: "/schedule" },
  { id: "fees", label: "Fees & Payments", icon: IconCreditCard, route: "/fees" },
  { id: "profile", label: "Profile", icon: IconUser, route: "/profile" },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
<<<<<<< HEAD
    <Sidebar className=" bg-[#0A1931] text-white flex flex-col h-screen px-1 py-3">

      {/* HEADER */}
      <SidebarHeader className="border-b border-white/10">
        <div className="flex gap-3 items-center">
                  <Link to="/">
                        <img
                            src={Logo} 
                            className="w-12 h-12 rounded-full "
                            alt="Minia University logo"
                        />
                    </Link>
                  <div>
                    <h1 className="m-0 text-lg font-bold">Minia University</h1>
                    <p className="m-0 text-xs font-medium">International Students Partal</p>
                  </div>
                </div>
      </SidebarHeader>
=======
    <div className="flex relative flex-row-reverse h-dvh ">
      <Sidebar
        side="left"
        variant="sidebar"
        collapsible="icon"
        className="w-64 border-r"
      >
        {!activeItem ? (
          <>
            <SidebarHeader>
              <TeamSwitcher teams={data.teams} />
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarTrigger />
                    </SidebarMenuItem>
                    {sidebarItems.map((item) => {
                      const Icon = item.icon;
                      const chevronIndicator = (
                        <IconChevronRight className="h-4 w-4 transition-transform shrink-0" />
                      );
>>>>>>> 92f6f64e3dc6a2b7b08523880452d721f28bdcb6

      {/* MENU */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>

<<<<<<< HEAD
              {menuItems.map((item) => {
                const Icon = item.icon;
                  const isActive  = location.pathname === item.route;
=======
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="w-full h-12 px-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-8 w-8 rounded-full">
                        <AvatarImage src="/avatar-01.png" alt="ephraim" />
                        <AvatarFallback className="rounded-full">
                          E
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-sm font-medium truncate">
                          ephraim
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          ephraim@blocks.so
                        </div>
                      </div>
                    </div>
                    <IconLogout className="h-4 w-4 shrink-0" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </>
        ) : (
          activeItemData?.subItems && (
            <>
              <SidebarHeader className="flex flex-row items-center justify-between border-b px-4">
                <button
                  title="back"
                  onClick={handleBackToMain}
                  className="h-8 w-8 p-0 rounded-md hover:bg-sidebar-accent flex items-center justify-center"
                >
                  <IconArrowLeft className="h-4 w-4" />
                </button>
                <h3 className="font-medium flex-1 text-center">
                  {activeItemData.label}
                </h3>
                <div className="w-8" />
              </SidebarHeader>
>>>>>>> 92f6f64e3dc6a2b7b08523880452d721f28bdcb6


                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => {
                        navigate(item.route);
                      }}
                      className={`flex items-center gap-3 h-11 px-4 rounded-lg transition cursor-pointer
                        ${isActive
                          ? "bg-white/10 border-l-4 border-[#C5A059]"
                          : "hover:bg-white/5"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {item.label}
                      </span>
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