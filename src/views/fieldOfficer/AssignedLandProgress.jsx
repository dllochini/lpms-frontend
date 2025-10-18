// LandProgressTracking.jsx
import React, { useState, useEffect } from "react";
import { Typography, Box, Paper, Button, Breadcrumbs, CircularProgress } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
// import { useNavigate } from "react-router-dom";
import LandDataGrid from "../../components/fieldOfficer/LandDataGrid";
import {Snackbar, Alert} from "@mui/material";
// Import your API helpers
import workdone, {getWorkDoneByTaskId} from "../../api/workdone";
import { getOperations } from "../../api/operation";
import { useGetFieldOfficerLands } from "../../hooks/land.hooks";
import { useMemo } from "react";
import { useGetAllTasks } from "../../hooks/task.hooks";
import { useGetAllWorkDone } from "../../hooks/workdone.hooks";

export default function AssignedLandProgress() {
  // const navigate = useNavigate();

  // Stores aggregated land data for the DataGrid
  // const [lands, setLands] = useState([]);

  // Loading state for spinner
  const [loading, setLoading] = useState(true);

  // Snackbar state for messages
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const {data: foLandData = [], isLoading} = useGetFieldOfficerLands(localStorage.getItem("loggedUserId"), {
    onSuccess: (data) => {
      console.log("Lands for field officer:", data);
    },
    onError: (error) => {
      console.error("Failed to fetch lands for field officer", error);
    },
  });

  const { data: taskData = [], isLoading: isLoadingTasks } = useGetAllTasks(localStorage.getItem("loggedUserId"), {
    onSuccess: (data) => {
      console.log("All tasks data:", data);
    },
    onError: (error) => {
      console.error("Failed to fetch all tasks", error);
    },
  });

  const { data: workDoneData = [], isLoading: isLoadingWorkDone } = useGetAllWorkDone({
    onSuccess: (data) => {
      console.log("All work done data:", data);
    },
    onError: (error) => {
      console.error("Failed to fetch all work done data", error);
    },
  });

  const lands = useMemo(() => {
    if(!Array.isArray(foLandData) || !Array.isArray(taskData)) return [];
    return foLandData.map((land) => {
      // Find tasks for this land
      const tasksForLand = taskData.filter((task) => task?.process?.land === land._id).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      const currentTask = tasksForLand?.[0] ?? null;
      // current task workdone
      console.log("all workdone data:", workDoneData);

      return {
        _id: land._id,
        size: land.size,
        status: currentTask?.status ?? "No Task",
        taskName: currentTask?.operation?.name,
      }
    });      
  }, [foLandData, taskData, workDoneData]);

    const handleUpdate = async (landId) => {};

  // // Handle update
  // const handleUpdate = async (landId) => {
  //   try {
  //     const payload = {}; // Put actual fields to update
  //     await updateLand(landId, payload);
  //     setSnackbarMessage(`Land ${landId} updated`);
  //     setSnackbarSeverity("success");
  //     setSnackbarOpen(true);
  //     // Refresh after update
  //     await fetchAggregatedLands();
  //   } catch (err) {
  //     console.error("Failed to update land", err);
  //     setSnackbarMessage(`Failed to update land ${landId}`);
  //     setSnackbarSeverity("error");
  //     setSnackbarOpen(true);
  //   }
  // };

  return (
    <Box sx={{ mb: 1.8 }}>
      {/* Header & breadcrumb */}
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Land Progress Tracking
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Typography color="text.primary">
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
            Home
          </Typography>
          <Typography color="text.primary">Progress Tracking</Typography>
        </Breadcrumbs>
      </Box>

      <Paper elevation={5} sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}>

        {isLoading || isLoadingTasks ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <LandDataGrid data={lands} onUpdate={handleUpdate} />
        )}
      </Paper>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
