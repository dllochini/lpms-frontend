// views/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon, Logout, AccountCircle, ExpandMore } from "@mui/icons-material";
import companyLogo from "/images/CeylonSugarLogo.png";
import { clearAuth } from "../../utils/auth";
import { redirectProfileByRole } from "../../utils/redirectProfileByRole";

const navItems = [
  { label: "Dashboard", path: "/higherManager" },
  { label: "Land Progress", path: "/higherManager/landProgress" },
  { label: "Approve Payments", path: "/higherManager/approvePayments" },
];

const drawerWidth = 260;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setUserName(localStorage.getItem("name") || "");
    setRole(localStorage.getItem("role") || "");
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen((v) => !v);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    clearAuth();
    navigate("/login", { replace: true });
  };

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
        }}
        onClick={() => {
          navigate("/");
          if (!isMdUp) setDrawerOpen(false);
        }}
      >
        <Box component="img" src={companyLogo} sx={{ height: 40 }} alt="Company logo" />
        <Typography variant="h6" noWrap sx={{ ml: 1 }}>
          Ceylon Sugar
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flex: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => {
              navigate(item.path);
              if (!isMdUp) setDrawerOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        <Divider />
        <Typography variant="caption" color="text.secondary" display="block" align="center" sx={{ mt: 1 }}>
          © 2025 Ceylon Sugar Industries
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <AppBar position="fixed" color="default" elevation={1} sx={{ zIndex: (t) => t.zIndex.drawer + 1, borderRadius: 0 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isMdUp && (
              <IconButton edge="start" onClick={toggleDrawer} aria-label="open navigation" size="large">
                <MenuIcon />
              </IconButton>
            )}
            <Box
              component="img"
              src={companyLogo}
              alt="Company logo"
              sx={{ height: 44, cursor: "pointer" }}
              onClick={() => window.open("https://ceylonsugar.com", "_blank")}
            />
          </Box>

          <Box sx={{ flex: 1 }} /> {/* spacer instead of tabs */}

          <Box
            onClick={handleMenuOpen}
            role="button"
            aria-haspopup="true"
            aria-controls={menuOpen ? "user-menu" : undefined}
            aria-expanded={menuOpen ? "true" : undefined}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <Box sx={{ textAlign: "right", lineHeight: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} noWrap>
                {userName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {role}
              </Typography>
            </Box>
            <ExpandMore fontSize="small" color="action" />
          </Box>

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            disableScrollLock
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            MenuListProps={{ "aria-labelledby": "user-button" }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(redirectProfileByRole(role));
              }}
            >
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
        <Divider />
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flex: 1, p: 3, bgcolor: "grey.50" }}>
        <Toolbar /> {/* spacer for fixed AppBar */}
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: "grey.900",
          color: "grey.300",
          p: 2,
          textAlign: "center",
          borderTop: "1px solid #444",
        }}
      >
        <Typography variant="body2">
          © 2025 Ceylon Sugar Industries – Land Preparation System. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
