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
);

