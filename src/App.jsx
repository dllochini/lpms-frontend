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
import FieldOperations from "./views/fieldOfficer/FieldOperations/FieldOperations";
import FarmResources from "./views/fieldOfficer/FarmResources/FarmResources";
import LandRegistry from "./views/fieldOfficer/LandRegistry/LandRegistry";
import AssignedLandProgress from "./views/fieldOfficer/AssignedLandProgress/AssignedLandProgress";
import LandProgressTracking from "./views/fieldOfficer/ProgressTrack/main/ProgressTrack";

import LandRegistrationPage1 from "./views/fieldOfficer/FarmerLandManagement/Registration/LandRegistration1";
import LandRegistrationPage2 from "./views/fieldOfficer/FarmerLandManagement/Registration/LandRegistration2";
import LandRegistrationPage3 from "./views/fieldOfficer/FarmerLandManagement/Registration/LandRegistration3";
import LandRegistrationPage4 from "./views/fieldOfficer/FarmerLandManagement/Registration/LandRegistration4";

import LandEditPage1 from "./views/fieldOfficer/FarmerLandManagement/Edit/LandEdit1";
import LandEditPage2 from "./views/fieldOfficer/FarmerLandManagement/Edit/LandEdit2";
import LandEditPage3 from "./views/fieldOfficer/FarmerLandManagement/Edit/LandEdit3";
import LandEditPage4 from "./views/fieldOfficer/FarmerLandManagement/Edit/LandEdit4";

// Higher Manager
import HigherManagerDashboard from "./views/higherManager/Dashboard";
import HigherManagerLandProgress from "./views/higherManager/LandProgress";
import HigherManagerLandProgressTracking from "./views/higherManager/LandProgressTracking";
// import HigherManagerApprovePayments from "./views/higherManager/ApprovePayments";

//Manager
import Dashboard from "./views/manager/Dashboard/Dashboard";
import ApprovePayments from "./views/manager/PaymentApproval/ApprovePayments";
import ApproveOperations from "./views/manager/OperationApproval/ApproveOperations";
import DivisionProgress from "./views/manager/DivisionProgress";
import ViewLandProgress from "./views/manager/ProgressTrackView/ViewProgressTrack"

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
    const publicPaths = ["/login", "/resetPassword"];
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
        <Route path="approveOperations" element={<ApproveOperations />} />
        <Route path="approvePayments" element={<ApprovePayments />} />
        <Route path="divisionProgress" element={<DivisionProgress />} />
        <Route path="viewProgress/:landId" element={<ViewLandProgress />} />
      </Route>

      <Route path="/higherManager/" element={<HigherManagerLayout />}>
        <Route path="*" element={<NoPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="" element={<HigherManagerDashboard />} />
        <Route path="landProgress" element={<HigherManagerLandProgress />} />
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
