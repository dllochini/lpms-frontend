// views/Layout.jsx
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  Avatar,
  Box,
  Button,
} from "@mui/material";
import companyLogo from "/images/ceylon-sugar-industries.png";
import { clearAuth } from "../utils/auth"; // <-- make sure this path is correct

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth(); // clears token/role and axios header
    navigate("/login", { replace: true }); // prevent back navigation
  };

  return (
    <>
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
            {/* optional: replace Avatar with user initials or image */}
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

      <Box component="main" flex={1} p={3}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: "black",
          color: "white",
          p: 2,
          mt: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
          © 2025 Ceylon Sugar Industries – Land Preparation System. All Rights
          Reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Layout;
