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
import ResetPw from "./views/ResetPw";
import HigherManager from "./views/higherManager/HigherManager";
import FieldOfficer from "./views/fieldOfficer/FieldOfficer";
import { useEffect } from "react";
import { isTokenExpired, clearAuth } from "./utils/auth"; // import helpers

// A wrapper component so we can use hooks like useNavigate
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
