// src/pages/admin/LandsDashboard.js
import { Typography, Box, Paper, Button, Breadcrumbs } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLands } from "../../api/land"; // <-- new API for lands
import LandsDataGrid from "../../components/fieldOfficer/LandDataGrid";

export default function LandsDashboard() {
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);

  const fetchData = async () => {
    const response = await getLands();
    setLands(response?.data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (deletedLandId) => {
    setLands((prev) => prev.filter((land) => land._id !== deletedLandId));
  };

  return (
    <Box sx={{ mb: 1.8 }}>
      {/* Breadcrumb */}
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Farmer & Lands Registry
        </Typography>

        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Typography color="text.primary">
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
            Home / Farmers & Lands
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
          <Typography variant="h6">Registered Lands</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/lands/register")}
          >
            ADD NEW LAND
          </Button>
        </Box>

        <LandsDataGrid data={lands} onDelete={handleDelete} />
      </Paper>
    </Box>
  );
}
