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
import Operation from "./views/fieldOfficer/Operation";
import Resource from "./views/fieldOfficer/Resources";
import { useEffect } from "react";
import FieldOfficer from "./views/fieldOfficer/FieldOfficer";
import { isTokenExpired, clearAuth } from "./utils/auth"; // import helpers

// A wrapper component so we can use hooks like useNavigate
const AppWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
  const token = localStorage.getItem("token");

  // allow login and reset-password routes without JWT
  const publicPaths = ["/login", "/reset-password"];
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
        <Route path="/fieldOfficer/operation" element={<Operation />} />
        <Route path="/fieldOfficer/resources" element={<Resource />} />
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
