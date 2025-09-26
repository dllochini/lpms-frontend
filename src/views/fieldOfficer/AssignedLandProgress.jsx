// LandProgressTracking.jsx
import React, { useState, useEffect } from "react";
import { Typography, Box, Paper, Button, Breadcrumbs, CircularProgress } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
// import { useNavigate } from "react-router-dom";
import LandDataGrid from "../../components/fieldOfficer/LandDataGrid";
import {Snackbar, Alert} from "@mui/material";
// Import your API helpers
import { getLands } from "../../api/land";
import { getTasksByLandId } from "../../api/task";
import {getWorkDoneByTaskId} from "../../api/workdone";
import { getOperations } from "../../api/operation";

export default function AssignedLandProgress() {
  // const navigate = useNavigate();

  // Stores aggregated land data for the DataGrid
  const [lands, setLands] = useState([]);

  // Loading state for spinner
  const [loading, setLoading] = useState(true);

  // Snackbar state for messages
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch all lands + tasks + workdone + operations
  const fetchAggregatedLands = async () => {
    setLoading(true);
    try {
      // 1️⃣ Fetch lands
      const landsRes = await getLands();
      console.log("Fetched lands:", landsRes);
      const landsData = landsRes?.data ?? landsRes ?? [];

      // 2️⃣ Fetch operations (for overall progress)
      const operationsRes = await getOperations();
      const operations = operationsRes?.data ?? operationsRes ?? [];

      // 3️⃣ Fetch tasks and workdone for each land
      const aggregated = await Promise.all(
        landsData.map(async (land) => {
          // Fetch tasks for this land
          const tasksRes = await getTasksByLandId(land.landId);
          const tasks = tasksRes?.data ?? [];

          // Pick current task: first pending task
          const currentTask = tasks.find((t) => t.status.toLowerCase() === "pending") ?? null;

          // Compute current task progress from WorkDone
          let taskProgressPercent = 0;
          if (currentTask) {
            const workRes = await getWorkDoneByTaskId(currentTask.taskId);
            const workDoneList = workRes?.data ?? [];
            // Simple example: amount / expected_amount
            const totalAmount = workDoneList.reduce((sum, w) => sum + (w.amount ?? 0), 0);
            const expected = currentTask.expected_amount ?? 100; // fallback
            taskProgressPercent = Math.min(100, (totalAmount / expected) * 100);
          }

          // Compute overall progress (weighted by operation if available)
          let overallProgressPercent = 0;
          let totalWeight = 0;
          let weightedSum = 0;
          for (const task of tasks) {
            const op = operations.find((o) => o.operationId === task.operationId);
            const weight = op?.weight ?? 1;
            let progress = 0;
            // Fetch workdone for this task to compute task-level progress
            const workRes = await getWorkDoneByTaskId(task.taskId);
            const workDoneList = workRes?.data ?? [];
            const totalAmount = workDoneList.reduce((sum, w) => sum + (w.amount ?? 0), 0);
            const expected = task.expected_amount ?? 100;
            progress = Math.min(100, (totalAmount / expected) * 100);
            weightedSum += (progress / 100) * weight;
            totalWeight += weight;
          }
          overallProgressPercent = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;

          return {
            ...land,
            currentTask,
            taskProgressPercent,
            overallProgressPercent,
          };
        })
      );

      setLands(aggregated);
    } catch (err) {
      console.error("Failed to load aggregated lands", err);
      setSnackbarMessage("Failed to load lands. See console for details.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAggregatedLands();
  }, []);

  // Handle deletion
  const handleDelete = async (landId) => {
    try {
      // Call API to delete land
      await deleteLandById(landId);
      // Remove from local state
      setLands((prev) => prev.filter((l) => l.landId !== landId));
      setSnackbarMessage(`Land ${landId} deleted`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to delete land", err);
      setSnackbarMessage(`Failed to delete land ${landId}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle update
  const handleUpdate = async (landId) => {
    try {
      const payload = {}; // Put actual fields to update
      await updateLand(landId, payload);
      setSnackbarMessage(`Land ${landId} updated`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // Refresh after update
      await fetchAggregatedLands();
    } catch (err) {
      console.error("Failed to update land", err);
      setSnackbarMessage(`Failed to update land ${landId}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

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

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <LandDataGrid data={lands} onDelete={handleDelete} onUpdate={handleUpdate} />
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
