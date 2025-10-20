// App.jsx
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useEffect } from "react";
import { isTokenExpired, clearAuth } from "./utils/auth"; // import helpers

import Login from "./views/Login";
import ResetPw from "./views/ResetPw";
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
import LandProgressTracking from "./views/fieldOfficer/ProgressTrack/ProgressTrack";

import LandRegistrationPage1 from "./views/fieldOfficer/FarmerLandRegistration/LandRegistration1";
import LandRegistrationPage2 from "./views/fieldOfficer/FarmerLandRegistration/LandRegistration2";
import LandRegistrationPage3 from "./views/fieldOfficer/FarmerLandRegistration/LandRegistration3";
import LandRegistrationPage4 from "./views/fieldOfficer/FarmerLandRegistration/LandRegistration4";

import LandEditPage1 from "./views/fieldOfficer/FarmerLandEdit/LandEdit1";
import LandEditPage2 from "./views/fieldOfficer/FarmerLandEdit/LandEdit2";
import LandEditPage3 from "./views/fieldOfficer/FarmerLandEdit/LandEdit3";
import LandEditPage4 from "./views/fieldOfficer/FarmerLandEdit/LandEdit4";

// Higher Manager
import HigherManagerDashboard from "./views/higherManager/Dashboard";
import HigherManagerLandProgress from "./views/higherManager/LandProgress";
import HigherManagerLandProgressTracking from "./views/higherManager/LandProgressTracking";
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

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/resetPassword" element={<ResetPw />} />

      {/* Admin */}
      <Route path="/admin/" element={<AdminLayout />}>
        <Route path="*" element={<NoPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="" element={<AdminDashboard />} />
        <Route path="register" element={<UserRegistration />} />
        <Route path="edit/:userId" element={<UserEdit />} />
      </Route>

      {/* Field Officer */}
      <Route path="/fieldOfficer/" element={<FieldOfficerLayout />}>
        <Route path="*" element={<NoPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="" element={<FieldOfficerDashboard />} />
        <Route path="fieldOperations" element={<FieldOperations />} />
        <Route path="farmResources" element={<FarmResources />} />
        <Route path="landRegistry" element={<LandRegistry />} />
        <Route path="assignedLandProgress" element={<AssignedLandProgress />} />
        <Route path="landProgressTracking/:landId" element={<LandProgressTracking />} />
        {/* Land Registration */}
        <Route path="landRegistration1" element={<LandRegistrationPage1 />} />
        <Route path="landRegistration2" element={<LandRegistrationPage2 />} />
        <Route path="landRegistration3" element={<LandRegistrationPage3 />} />
        <Route path="landRegistration4" element={<LandRegistrationPage4 />} />

        <Route path="landEdit1/:landId" element={<LandEditPage1 />} />
        <Route path="landEdit2/:landId" element={<LandEditPage2 />} />
        <Route path="landEdit3/:landId" element={<LandEditPage3 />} />
        <Route path="landEdit4/:landId" element={<LandEditPage4 />} />
      </Route>

      {/* Manager */}
      <Route path="/manager/" element={<ManagerLayout />}>
        <Route path="*" element={<NoPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="" element={<Dashboard />} />
        <Route path="approveOperations" element={<ApproveOperations/>} />
        <Route path="approvePayments" element={<ManagerApprovePayments />} />
        <Route path="divisionProgress" element={<DivisionProgress />} />
      </Route>

      <Route path="/higherManager/" element={<HigherManagerLayout />}>
        <Route path="*" element={<NoPage />} />
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

const queryClient = new QueryClient()

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppWrapper />
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
