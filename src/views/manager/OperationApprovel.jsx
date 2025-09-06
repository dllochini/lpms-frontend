// import React from "react";
import { Typography, Box, Paper, Button, Breadcrumbs } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { getUsers } from "../../api/user";
import { useState, useEffect } from "react";
import OperationDataGrid from "../../components/manager/OperationGrid";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import OperationDialog from "../../components/manager/OperationDialog";


export default function Dashboard() {
  // const navigate = useNavigate();
  const [responseData, setResponseData] = useState([]);

  const fetchData = async function () {
  try {
    const response = await getUsers();
    setResponseData(response?.data ?? []);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    // Optionally show an error message to the user
  }
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
    <Box sx={{ mb: 1.8 }}>
      <Stack spacing={2} direction="row" color="primary"
      sx={{
        display: "flex",
        justifyContent: "center", // horizontal center
        alignItems: "center",     // vertical center
        borderRadius: "50%", 
      }}
    >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/user/register")}
          >
            Home
          </Button>
          <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/user/register")}
          >
            Operation Approval 
          </Button>
          <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/user/register")}
              >
              Payment Approval    
          </Button>
          <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/user/register")}
              >
              Land Process    
          </Button>
      </Stack>
  
      {/* Greeting & Breadcrumb */}
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Pending Operations Approval
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
          
        </Box>
        <OperationDataGrid data={responseData} onDelete={handleDelete} />
      </Paper>
    </Box>
  );
}
