import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { redirectByRole } from "../utils/redirectByRole";

const NoPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        bgcolor: "#f5f5f5",
        p: 3,
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 400 }}>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(redirectByRole(role))}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NoPage;
