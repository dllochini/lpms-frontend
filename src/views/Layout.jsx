import { Outlet, Link } from "react-router-dom";
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
// import AdbIcon from '@mui/icons-material/Adb';
// import IconButton from "@mui/material";
import companyLogo from "/images/ceylon-sugar-industries.png";

const Layout = () => {
  return (
    <>

      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            component="img"
            src={companyLogo} // <-- replace with your logo path
            // alt="Company Logo"
            sx={{
              height: 50, // adjust as needed
              mr: 2,
              my: 1.5, // margin-right for spacing
              // border: "2px solid black",
            }}
          />
          <Avatar
            alt="Land Avatar"
            // src="https://via.placeholder.com/40"
            sx={{
              width: 40,
              height: 40,
              // border: "2px solid black"
            }}
          />
        </Toolbar>
      </AppBar>

      <Box component="main" flex={1} p={3}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'black', color: 'white', p: 2, mt: 4, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
          © 2025 Ceylon Sugar Industries – Land Preparation System. All Rights Reserved.
        </Typography>
      </Box>

    </>
  );
};

export default Layout;
