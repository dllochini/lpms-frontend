import React from "react";
import { Typography, Box, Breadcrumbs, Link } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink, useParams } from "react-router-dom";
import ProcessOverview from "./ProcessOverview";
import { useGetProcessByLandId } from "../../../hooks/process.hook";

export default function ProgressTrack() {
  const { landId } = useParams();
  const { data: landProcesses = [], isLoading } = useGetProcessByLandId(
    landId,
    {
      onSuccess: (data) => {
        console.log("Lands for field officer:", data);
      },
      onError: (error) => {
        console.error("Failed to fetch lands for field officer", error);
      },
    }
  );

  return (
    <Box>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3, pb: 0 }}>
        <Typography variant="h5" gutterBottom>
          L1324 Progress Overview
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

      {landProcesses.map((process, index) => (
        <ProcessOverview key={process._id ?? index} process={process} />
      ))}
    </Box>
  );
}
