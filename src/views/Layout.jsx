// views/Layout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Button,
} from "@mui/material";
import companyLogo from "/images/ceylon-sugar-industries.png";
import { clearAuth } from "../utils/auth";

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // full viewport height
      }}
    >
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            component="img"
            src={companyLogo}
            sx={{
              height: 50,
              mr: 2,
              my: 1.5,
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 40, height: 40 }} />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              sx={{ textTransform: "none", fontWeight: 600, mx: 2 }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "black",
          color: "white",
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
          © 2025 Ceylon Sugar Industries – Land Preparation System. All Rights
          Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
