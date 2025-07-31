import { Outlet, Link } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Paper,
//   Box,
//   Button,
// } from "@mui/material";
// import AdbIcon from '@mui/icons-material/Adb';
// import IconButton from "@mui/material";

const Layout = () => {
  return (
    <>  
     
      <Outlet />

      {/* <Box
        component="footer"
        sx={{
          backgroundColor: "#fff",
          color: "black",
          textAlign: "center",
          py: 3,
          position: "relative",
          width: "100%",
          // mt: 2,
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </Typography>
      </Box> */}
    </>
  );
};

export default Layout;