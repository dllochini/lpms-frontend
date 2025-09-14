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
import FieldOfficer from "./views/fieldOfficer/FieldOfficer";
import Resources from "./views/fieldOfficer/Resources";
import Operation from "./views/fieldOfficer/Operation";

// Higher Manager
import Accountant from "./views/accountant/Accountant";
import HigherManager from "./views/higherManager/HigherManager";

//Manager
import ManagerDashboard from "./views/manager/Dashboard";
import PendingPaymentApprovel from "./views/manager/PendingPaymentApprovel";

//Layout
import ManagerLayout from "./views/layout/Manager";
import FieldOfficerLayout from "./views/layout/FieldOfficer";
import AdminLayout from "./views/layout/Admin";

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
      <Route path="/reset-password" element={<ResetPw />} />
      {/* <Route path="/manager" element={<Manager />} /> */}

      <Route path="/accountant" element={<Accountant />} />
      <Route path="/higherManager" element={<HigherManager />} />
      <Route index element={<Home />} />
      <Route path="*" element={<NoPage />} />

      <Route path="/admin/" element={<AdminLayout />}>
      <Route path="profile" element={<Profile />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="register" element={<UserRegistration />} />
        <Route path="edit/:userId" element={<UserEdit />} />
      </Route>

      <Route path="/fieldOfficer/" element={<FieldOfficerLayout />}>
        <Route path="" element={<FieldOfficer />} />
        <Route path="operation" element={<Operation />} />
        <Route path="resources" element={<Resources />} />
      </Route>

      <Route path="/manager/" element={<ManagerLayout />}>
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="pendingPaymentApprovel" element={<PendingPaymentApprovel />} />
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
