import { Typography, Paper, Breadcrumbs, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useState } from "react";
const HigherManager = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(localStorage.getItem("name") || "");
  }, []);
  
  return (
    <>
      <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>
        {/* Greeting Card */}
        <Paper
          sx={{
            mx: "auto",
            p: 3,
            mb: 3,
            borderRadius: 4,
            background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
          }}
          elevation={0}
        >
          <Typography variant="h5" gutterBottom>
            Hello {userName} 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back to the Agricultural Land Preparation System Dashboard.
          </Typography>
        </Paper>
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", pl: 2 }}>
          <Typography color="text.primary">
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
            Home
          </Typography>
        </Breadcrumbs>
      </Box>
    </>
  );
};

export default HigherManager;
