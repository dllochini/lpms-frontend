import { useState, useEffect } from "react";
import "./App.css";
// import Table from './views/components/Table'
// import { sampleGetAPI } from './api/user'
import Layout from "./views/pages/Layout";
import Login from "./views/pages/Login";
import Home from "./views/pages/Home";
import NoPage from "./views/pages/NoPage";
import ExecutiveDashboard from "./views/pages/ExecutiveDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NoPage />} />
            <Route path="/executive/dashboard" element={<ExecutiveDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
