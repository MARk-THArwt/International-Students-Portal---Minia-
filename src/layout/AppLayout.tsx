import { TooltipProvider } from "../components/ui/tooltip";
import { AppSidebar } from "../components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { Outlet } from "react-router-dom";
export const AppLayout = () => {
  return (
    <TooltipProvider>
      <SidebarProvider>

        <AppSidebar />

        <SidebarInset>
          <SidebarTrigger className="md:hidden" />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};
