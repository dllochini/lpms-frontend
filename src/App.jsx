// App.jsx
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { isTokenExpired, clearAuth } from "./utils/auth"; // import helpers

import Login from "./views/Login";
import ResetPw from "./views/ResetPw"; 
import Home from "./views/Home";
import NoPage from "./views/NoPage";
import Profile from "./views/Profile";

//Admin
import AdminDashboard from "./views/admin/Dashboard";
import UserRegistration from "./views/admin/UserRegistration";
import UserEdit from "./views/admin/UserEdit";

// FieldOfficer
import FieldOfficerDashboard from "./views/fieldOfficer/Dashboard";
import FieldOperations from "./views/fieldOfficer/FieldOperations";
import FarmResources from "./views/fieldOfficer/FarmResources";
import LandRegistry from "./views/fieldOfficer/LandRegistry";
import AssignedLandProgress from "./views/fieldOfficer/AssignedLandProgress";

// Higher Manager
import HigherManagerDashboard from "./views/higherManager/Dashboard";
import HigherManagerLandProgress from "./views/higherManager/LandProgress";
import HigherManagerApprovePayments from "./views/higherManager/ApprovePayments";

//Manager
import Dashboard from "./views/manager/Dashboard";
import ManagerApprovePayments from "./views/manager/ApprovePayments";
import ApproveOperations from "./views/manager/ApproveOperations";
import DivisionProgress from "./views/manager/DivisionProgress";

//Layout
import ManagerLayout from "./views/layout/Manager";
import FieldOfficerLayout from "./views/layout/FieldOfficer";
import AdminLayout from "./views/layout/Admin";
import HigherManagerLayout from "./views/layout/HigherManager";

const AppWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicPaths = ["/login", "/reset-password"];
    const bypassAuth = import.meta.env.VITE_BYPASS_AUTH === "true";

    if (!bypassAuth) {
      if (
        (!token || isTokenExpired(token)) &&
        !publicPaths.includes(location.pathname)
      ) {
        clearAuth();
        navigate("/login");
      }
    }
  }, [navigate, location]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/resetPassword" element={<ResetPw />} />

      <Route index element={<Home />} />
      <Route path="*" element={<NoPage />} />

      {/* Admin */}
      <Route path="/admin/" element={<AdminLayout />}>
        <Route path="profile" element={<Profile />} />
        <Route path="" element={<AdminDashboard />} />
        <Route path="register" element={<UserRegistration />} />
        <Route path="edit/:userId" element={<UserEdit />} />
      </Route>

      {/* Field Officer */}
      <Route path="/fieldOfficer/" element={<FieldOfficerLayout />}>
        <Route path="profile" element={<Profile />} />
        <Route path="" element={<FieldOfficerDashboard />} />
        <Route path="fieldOperations" element={<FieldOperations />} />
        <Route path="farmResources" element={<FarmResources />} />
        <Route path="landRegistry" element={<LandRegistry />} />
        <Route path="assignedLandProgress" element={<AssignedLandProgress />} />
      </Route>

      {/* Manager */}
      <Route path="/manager/" element={<ManagerLayout />}>
        <Route path="profile" element={<Profile />} />
        <Route path="" element={<Dashboard />} />
        <Route path="approveOperations" element={<ApproveOperations />} />
        <Route path="approvePayments" element={<ManagerApprovePayments />} />
        <Route path="divisionProgress" element={<DivisionProgress />} />
      </Route>

      <Route path="/higherManager/" element={<HigherManagerLayout />}>
        <Route path="profile" element={<Profile />} />
        <Route path="" element={<HigherManagerDashboard />} />
        <Route path="landProgress" element={<HigherManagerLandProgress />} />
        <Route
          path="approvePayments"
          element={<HigherManagerApprovePayments />}
        />
      </Route>
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);

export default App;
