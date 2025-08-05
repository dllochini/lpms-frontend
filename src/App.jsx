import { useState, useEffect } from "react";
import "./App.css";
// import Table from './views/components/Table'
// import { sampleGetAPI } from './api/user'
import Layout from "./views/pages/Layout";
import Login from "./views/pages/Login";
import ForgotPw from "./views/pages/ForgotPw";
import Home from "./views/pages/Home";
import NoPage from "./views/pages/NoPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPw" element={<ForgotPw />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
