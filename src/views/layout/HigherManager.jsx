// views/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
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
import {
  Menu as MenuIcon,
  Logout,
  AccountCircle,
  ExpandMore,
} from "@mui/icons-material";
import companyLogo from "/images/ceylon-sugar-industries.png";
import { clearAuth } from "../../utils/auth";
import {redirectProfileByRole} from "../../utils/redirectProfileByRole"


const navItems = [
  { label: "Dashboard", path: "/higherManager" },
  { label: "Land Progress", path: "/higherManager/landProgress" },
  {
    label: "Approve Payments",
    path: "/higherManager/approvePayments",
  },
];

const drawerWidth = 260;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // Replace with real user from auth/context
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setUserName(localStorage.getItem("name") || "");
    setRole(localStorage.getItem("role") || "");
  }, []);

  // tabs state (index) — derived from current route
  const [tabValue, setTabValue] = useState(0);

  // user menu
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // responsive drawer for small screens
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Map route -> tab index
  useEffect(() => {
    const idx = navItems.findIndex((n) => n.path === location.pathname);
    setTabValue(idx === -1 ? false : idx);
  }, [location.pathname]);

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
    if (navItems[newValue]) navigate(navItems[newValue].path);
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    clearAuth();
    navigate("/login", { replace: true });
  };

  const toggleDrawer = () => setDrawerOpen((v) => !v);

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
        <Box
          component="img"
          src={companyLogo}
          sx={{ height: 40 }}
          alt="Company logo"
        />
        <Typography variant="h6" noWrap sx={{ ml: 1 }}>
          Ceylon Sugar
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flex: 1 }}>
        {navItems.map((item, idx) => (
          <ListItemButton
            key={item.label}
            selected={tabValue === idx}
            onClick={() => {
              navigate(item.path);
              setTabValue(idx);
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
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          align="center"
          sx={{ mt: 1 }}
        >
          © 2025 Ceylon Sugar Industries
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      {/* AppBar fixed so it's always visible; we include a Toolbar spacer in main */}
      <AppBar
        position="fixed"
        color="default"
        elevation={1}
        sx={{ zIndex: (t) => t.zIndex.drawer + 1,borderRadius:0, }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* hamburger only on small screens */}
            {!isMdUp && (
              <IconButton
                edge="start"
                onClick={toggleDrawer}
                aria-label="open navigation"
                size="large"
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo / clickable */}
            <Box
              component="img"
              src={companyLogo}
              alt="Company logo"
              sx={{ height: 44, cursor: "pointer" }}
              onClick={() => window.open("https://ceylonsugar.com", "_blank")}
            />
          </Box>

          {/* Centered tab area on md+ */}
          {isMdUp ? (
            <Box sx={{ flex: 1, mx: 2 }}>
              <Box sx={{ maxWidth: 1100, mx: "auto" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  centered
                  textColor="primary"
                  indicatorColor="primary"
                  aria-label="main navigation tabs"
                  sx={{
                    "& .MuiTab-root": {
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: 500,
                      minWidth: 140,
                    },
                  }}
                >
                  {navItems.map((n) => (
                    <Tab key={n.label} label={n.label} />
                  ))}
                </Tabs>
              </Box>
            </Box>
          ) : (
            // small screens: show app name centered (optional)
            <Box sx={{ flex: 1 }} />
          )}

          {/* Right: clickable name+role */}
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

          {/* user menu */}
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

        {/* Divider under appbar; tabs exist in toolbar area for small screens? we use drawer instead */}
        <Divider />
      </AppBar>

      {/* Drawer for small screens (temporary) and permanent drawer option could be added for md+ */}
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

      {/* Main: include Toolbar spacer so content sits below the fixed AppBar */}
      <Box component="main" sx={{ flex: 1, p: 3, bgcolor: "grey.50" }}>
        <Toolbar /> {/* spacer for fixed AppBar */}
        <Outlet />
      </Box>

      {/* Footer */}
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
          © 2025 Ceylon Sugar Industries – Land Preparation System. All Rights
          Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
