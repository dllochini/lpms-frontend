import { useState, useEffect } from "react";
import "./App.css";
// import Table from './views/components/Table'
// import { sampleGetAPI } from './api/user'
import Layout from "./views/Layout";
import Login from "./views/Login";
import Home from "./views/Home";
import NoPage from "./views/NoPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./views/admin/Dashboard";
import UserRegistration from "./views/admin/UserRegistration";
import Manager from "./views/manager/Manager";
import Accountant from "./views/accountant/Accountant";
import UserEdit from "./views/admin/UserEdit";
import ResetPw from "./views/ResetPw";
import HigherManager from "./views/higherManager/HigherManager";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/resetPassword" element={<ResetPw />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NoPage />} />
            {/* <Route path="/executive/dashboard" element={<ExecutiveDashboard />} /> */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/user/register" element={<UserRegistration />} />
            <Route path="/user/edit/:userId" element={<UserEdit />} />
            <Route path="/manager" element={<Manager/>} />
            <Route path="/accountant" element={<Accountant/>} />
            <Route path="/higherManager" element={<HigherManager/>} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
};

export default App;
