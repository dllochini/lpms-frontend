import React from "react";
import { Typography, Box, Breadcrumbs, Link, CircularProgress } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink, useParams } from "react-router-dom";
import ProcessOverview from "./ViewProcessOverview";
import { useGetProcessByLandId } from "../../../hooks/process.hook";

export default function ProgressTrack() {
  const { landId } = useParams();

  const { data: landProcesses = [], isLoading } = useGetProcessByLandId(landId);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 2, pb: 0 }}>
        <Typography variant="h5" gutterBottom>
          {landId} Progress Overview
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Link
            component={RouterLink}
            to="/fieldOfficer"
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Home
          </Link>
          <Typography color="text.primary">Progress Overview</Typography>
        </Breadcrumbs>
      </Box>

      {[...landProcesses]
  .sort((a, b) => new Date(b.startedDate) - new Date(a.startedDate)) // newest first
  .map((proc, idx) => (
    <ProcessOverview key={proc._id ?? idx} process={proc} />
))}

    </Box>
  );
}
