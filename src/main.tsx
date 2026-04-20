import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from './store/store'
import { Provider } from 'react-redux'
import { Home } from "./pages/home/Home";
import { Contact } from "./pages/contact/contact";
import { Announcement } from "./pages/Announcement/announcement";
import { Services } from "./pages/ourServices/services";
import { Registration } from "./pages/registration/registration";
import Dashbord from "./pages/Dashbord/dashbord"

import { Toaster } from "sonner";
import { Login } from "./pages/Login/login";
import { TooltipProvider } from "./components/ui/tooltip";
import { AppSidebar } from "./components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";

createRoot(document.getElementById("root")!).render(
      <Provider store={store}>

  <BrowserRouter>
    <TooltipProvider>
      <SidebarProvider>
        <Toaster richColors />
        <AppSidebar />
        <SidebarTrigger className="md:hidden " />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Announcement" element={<Announcement />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/Registration" element={<Registration />} />
        </Routes>
      </SidebarProvider>
    </TooltipProvider>
  </BrowserRouter>,
);

