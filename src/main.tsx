import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./pages/home/Home";
import { Contact } from "./pages/contact/contact";
import { Announcement } from "./pages/Announcement/announcement";
import { Login } from "./pages/login/login";
import { Services } from "./pages/ourServices/services";
import { Registration } from "./pages/registration/registration";
import Dashbord from "./pages/Dashbord/dashbord"

import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Toaster richColors />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/Announcement" element={<Announcement />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Services" element={<Services />} />
      <Route path="/Registration" element={<Registration />} />
      <Route path="/Dashbord" element={<Dashbord/>}></Route>
    </Routes>
  </BrowserRouter>,
);

