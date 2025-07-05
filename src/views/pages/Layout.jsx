import { Outlet, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  Box,
  Button
} from "@mui/material";
// import AdbIcon from '@mui/icons-material/Adb';
// import IconButton from "@mui/material";

const Layout = () => {
  return (
    <>
      <AppBar
        position="static"
        elevation={100}
        sx={{
          backgroundColor: "#fff",
          color: "#000",
          // boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          
          // marginBottom: 3,
        }}
      >
        <Toolbar>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            LOGO
          </Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Contact</Button>
        </Toolbar>
      </AppBar>

      <Outlet />

      <Box
      component="footer"
      sx={{
        backgroundColor: '#fff',
        color: 'black',
        textAlign: 'center',
        py: 2,
        position: 'relative',
        bottom: 0,
        width: '100%',
        mt: 2, 
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </Typography>
    </Box>

    </>
  );
};

export default Layout;
