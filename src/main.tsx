import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Announcement } from "./pages/Announcement/announcement";
import { Contact } from "./pages/contact/contact";
import { Home } from "./pages/home/Home";
import { Services } from "./pages/ourServices/services";
import { Registration } from "./pages/registration/registration";
<<<<<<< HEAD
import Dashbord from "./pages/Dashbord/dashbord"
import { Login } from "./pages/login/login";
import {AppLayout} from './layout/AppLayout'


createRoot(document.getElementById("root")!).render(
      <Provider store={store}>
        
  <BrowserRouter>
   
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Announcement" element={<Announcement />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/Registration" element={<Registration />} />
          <Route element={ <AppLayout/>}>
          <Route path="/dashboard" element={<Dashbord />} />
          </Route>
          
        </Routes>
        
  </BrowserRouter>
  
  </Provider>,
=======

import { Toaster } from "sonner";
import { AppSidebar } from "./components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import { Login } from "./pages/Login/login";

createRoot(document.getElementById("root")!).render(
  // <Provider store={store}>

  <BrowserRouter>
    <TooltipProvider>
      <SidebarProvider>
        <Toaster richColors />
        <AppSidebar />
        <SidebarInset>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Announcement" element={<Announcement />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Services" element={<Services />} />
            <Route path="/Registration" element={<Registration />} />
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  </BrowserRouter>,
>>>>>>> 92f6f64e3dc6a2b7b08523880452d721f28bdcb6
);
