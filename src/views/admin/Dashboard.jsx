// import React from "react";
import { Typography, Box, Paper, Button, Breadcrumbs } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { getUsers } from "../../api/user";
import { useState, useEffect } from "react";
import UsersDataGrid from "./UsersDataGrid";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState([]);
  const [userName, setUserName] = useState("");

  const fetchData = async function () {
    const response = await getUsers();
    console.log("API users:", response.data);
    setResponseData(response?.data ?? []);
  };

  useEffect(() => {
    fetchData();
    setUserName(localStorage.getItem("name") || "");
  }, []);

  const handleDelete = (deletedUserId) => {
    setResponseData((prev) =>
      prev.filter((user) => user._id !== deletedUserId)
    );
  };

  return (
    <Box sx={{ mb: 1.8 }}>
      {/* Greeting & Breadcrumb */}
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

      {/* Main Content */}
      <Paper
        elevation={5}
        sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">System Users</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/register")}
          >
            CREATE NEW USER
          </Button>
        </Box>
        <UsersDataGrid data={responseData} onDelete={handleDelete} />
      </Paper>
    </Box>
  );
}
