import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./pages/home/Home";
import { Contact } from "./pages/contact/contact";
import { Announcement } from "./pages/Announcement/announcement";
import { Login } from "./pages/login/login";
import { Services } from "./pages/ourServices/services";
import { Registration } from "./pages/registration/registration";

<<<<<<< HEAD
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
createRoot(document.getElementById('root')!).render(
<BrowserRouter>
  <Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/Contact" element={<Contact/>}/>
  <Route path="/Announcement" element={<Announcement/>}/>
  <Route path="/Login" element={<Login/>}/>
  <Route path="/Services" element={<Services/>}/>
  <Route path="/Registration" element={<Registration/>}/>
  </Routes>
</BrowserRouter>
)
=======
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from "sonner";

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
    </Routes>
  </BrowserRouter>,
);
>>>>>>> a2265da49d2b814dc2fa9a7866a297f991219a37
