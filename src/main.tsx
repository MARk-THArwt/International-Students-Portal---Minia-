import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Contact } from "./pages/contact/contact";
import { Home } from "./pages/home/Home";
import { Services } from "./pages/ourServices/services";
import { Registration } from "./pages/registration/registration";
import { DashboardSwitcher } from "./pages/Dashbord/DashboardSwitcher";
import { StaffDashboard } from "./pages/Dashbord/StaffDashboard";
import { ProtectedStaffRoute } from "./pages/Dashbord/ProtectedStaffRoute";
import { ProtectedAdminRoute } from "./pages/Dashbord/ProtectedAdminRoute";
import { AdminDashboard } from "./pages/dashboard/AdminDashboard";
import { Login } from "./pages/login/login";
import { AppLayout } from "./layout/AppLayout";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { EventsList } from "./pages/Events/EventsList";
import Announcement from "./pages/Announcement/announcements";
import { NewRequest } from "./pages/newRequest/NewRequest";
import StudentProfile  from "./pages/profile/profile";
import { RegisterForm } from "./pages/register/RegisterForm";
import { UsersPage } from "./pages/users/users";

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
          <Route path="/dashboard/admin/users" element={<UsersPage />} />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
);
