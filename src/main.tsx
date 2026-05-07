import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  Contact  from "./pages/contact/contact";
import { Home } from "./pages/home/Home";
import { Services } from "./pages/ourServices/services";
import { DashboardSwitcher } from "./pages/Dashbord/DashboardSwitcher";
import { StaffDashboard } from "./pages/Dashbord/StaffDashboard";
import { ProtectedStaffRoute } from "./pages/Dashbord/ProtectedStaffRoute";
import { ProtectedAdminRoute } from "./pages/Dashbord/ProtectedAdminRoute";
import { AdminDashboard } from "./pages/dashboard/AdminDashboard";
import { Login } from "./pages/login/login";
import { AppLayout } from "./layout/AppLayout";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./i18n/i18n";
import { EventsList } from "./pages/Events/EventsList";
import Announcement from "./pages/Announcement/announcements";
import { NewRequest } from "./pages/newRequest/NewRequest";
import StudentProfile  from "./pages/profile/profile";
import { RegisterForm } from "./pages/register/RegisterForm";
import { UsersPage } from "./pages/users/users";
import { ServicesManagement } from "./pages/Services/ServicesManagement";
import RequestDetailsPage from "./pages/Dashbord/RequestDetailsPage";
import MainNav from "./layout/mainNavbar/navbar";

import { Toaster } from "@/components/ui/sonner";
const navigation = [
  { title: "Home", path: "/" },
  { title: "Services", path: "/Services" },
  { title: "Announcements", path: "/Announcement" },
  { title: "Contact", path: "/Contact" },
];
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Toaster richColors />
    <BrowserRouter>
      <Routes>
        <Route element={<MainNav navigation={navigation} />}>
          <Route index element={<Home />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Announcement" element={<Announcement />} />
          <Route path="/Services" element={<Services />} />
        </Route>
        <Route path="/Login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardSwitcher />} />
          <Route
            path="/staff-dashboard"
            element={
              <ProtectedStaffRoute>
                <StaffDashboard />
              </ProtectedStaffRoute>
            }
          />
          <Route path="/events" element={<EventsList />} />
          <Route path="/newRequest" element={<NewRequest />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/RegisterForm" element={<RegisterForm />} />
          <Route path="/users" element={<UsersPage />} />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/services-management"
            element={
              <ProtectedAdminRoute>
                <ServicesManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/dashboard/requests/:requestId"
            element={
              <ProtectedStaffRoute>
                <RequestDetailsPage />
              </ProtectedStaffRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
);

