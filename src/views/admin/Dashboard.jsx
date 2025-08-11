// import React from "react";
import { Typography, Box, Paper, Button, Breadcrumbs } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { getUsers } from "../../api/user";
import { useState, useEffect } from "react";
import BasicDataGrid from "../../components/admin/BasicDataGrid";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState([]);

  const fetchData = async function () {
    const response = await getUsers();
    // console.log("API users:", response.data);
    setResponseData(response?.data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (deletedUserId) => {
    setResponseData((prev) =>
      prev.filter((user) => user._id !== deletedUserId)
    );
  };

  return (
    <Box>
      {/* Greeting & Breadcrumb */}
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Hello Admin!
        </Typography>

        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
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
            onClick={() => navigate("/user/register")}
          >
            CREATE NEW USER
          </Button>
        </Box>
        <BasicDataGrid data={responseData} onDelete={handleDelete} />
      </Paper>
    </Box>
  );
}
