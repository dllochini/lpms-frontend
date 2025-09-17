
// App.jsx
import "./App.css";
import Layout from "./views/Layout";
import Login from "./views/Login";
import Home from "./views/Home";
import NoPage from "./views/NoPage";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AdminDashboard from "./views/admin/Dashboard";
import UserRegistration from "./views/admin/UserRegistration";
import Manager from "./views/manager/Manager";
import Accountant from "./views/accountant/Accountant";
import UserEdit from "./views/admin/UserEdit";
import ResetPw from "./views/ResetPw";
import HigherManager from "./views/higherManager/HigherManager";
import FieldOfficer from "./views/fieldOfficer/FieldOfficer";
import { useEffect } from "react";
import { isTokenExpired, clearAuth } from "./utils/auth"; // import helpers
import Operation from "./views/fieldOfficer/Operation";
import ProgressTrack from "./views/fieldOfficer/ProgressTrack";
import FieldOfficerDashboard from "./views/fieldOfficer/FieldOfficerDashboard";
import PendingOperationApproval from "./views/manager/landProgressView/PendingOperationApproval";
import ManagerProgressTrack from "./views/manager/landProgressView/ManagerProgressTrack";

// A wrapper component so we can use hooks like useNavigate
const AppWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicPaths = ["/login", "/reset-password"];

    // ✅ Read toggle flag from .env
    const bypassAuth = import.meta.env.VITE_BYPASS_AUTH === "true";

    // ✅ Skip auth check completely if bypass flag is on
    if (bypassAuth) {
      return;
    }

    // ✅ Enforce auth check if bypass is off
    if ((!token || isTokenExpired(token)) && !publicPaths.includes(location.pathname)) {
      clearAuth();
      navigate("/login");
    }
  }, [navigate, location]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPw />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NoPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/register" element={<UserRegistration />} />
        <Route path="/user/edit/:userId" element={<UserEdit />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/accountant" element={<Accountant />} />
        <Route path="/higherManager" element={<HigherManager />} />
        <Route path="/fieldOfficer" element={<FieldOfficer />} />
        <Route path="/fieldOfficer/operation" element={<Operation />} />
        <Route path="fieldOfficer/progressTrack" element={<ProgressTrack/>}/>
        <Route path="fieldOfficer/fieldOfficerDashboard" element={<FieldOfficerDashboard/>}/>
        <Route path="/manager/landProgressView/pendingOperationApproval" element={<PendingOperationApproval/>} />
        <Route 
          path="/manager/landProgressView/ManagerProgressTrack/:landId" 
          element={<ManagerProgressTrack/>} 
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