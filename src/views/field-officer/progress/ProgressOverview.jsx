import { Typography, Box, Breadcrumbs, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import LandProgressDataGrid from "../../../components/field-officer/LandProgressDataGrid";
export default function LandProgressTracking() {
  const navigate = useNavigate();

  const progressData = [
    {
      landId: "L1234",
      area: 10,
      status: "Rome Ploughing",
      statusProgress: "30%",
      overallProgress: "20%",
    },
    {
      landId: "L1235",
      area: 12,
      status: "Harrowing",
      statusProgress: "50%",
      overallProgress: "40%",
    },
  ];

  return (
    <Box>
      {/* Title & Breadcrumb */}
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Land Progress Tracking
        </Typography>

        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Typography
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            color="inherit"
            onClick={() => navigate("/")}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Home
          </Typography>
          <Typography color="text.primary">Progress Tracking</Typography>
        </Breadcrumbs>
      </Box>

      {/* Table */}
      <Paper
        elevation={3}
        sx={{
          maxWidth: 1100,
          mx: "auto",
          p: 2,
          borderRadius: 5,
        }}
      >
        <LandProgressDataGrid data={progressData} />
      </Paper>
      
    </Box>
  );
}
