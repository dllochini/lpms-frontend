import { Outlet, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import companyLogo from "/images/ceylon-sugar-industries.png";

const Layout = () => {
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
            }}
          />
          <Avatar
            alt="Land Avatar"
            sx={{
              width: 40,
              height: 40,
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "black",
          color: "white",
          p: 2,
          mt: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
          © 2025 Ceylon Sugar Industries – Land Preparation System. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
