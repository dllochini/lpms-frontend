
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Button,
  LinearProgress,
  Avatar,
  Stack,
  Collapse,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Link as RouterLink, useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

export default function LandProgressTracking() {
  const { landId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  useEffect(() => {
    setTasks([
      { id: 1, name: "Bush Clearing", progress: 100 },
      { id: 2, name: "Ploughing", progress: 50 },
      { id: 3, name: "Seeding", progress: 30 },
    ]);
  }, [landId]);

  const toggleExpand = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const columns = [
    { field: "id", headerName: "Task ID", width: 160, headerAlign: "center", align: "center" },
    { field: "date", headerName: "Date", width: 160, headerAlign: "center", align: "center" },
    { field: "machine", headerName: "Type of Machine", width: 180, headerAlign: "center", align: "center" },
    { field: "unit", headerName: "Unit of Measure", width: 160, headerAlign: "center", align: "center" },
    { field: "todayProgress", headerName: "Today Progress", width: 160, headerAlign: "center", align: "center" },
    { field: "note", headerName: "Note", width: 220, headerAlign: "center", align: "center" },
  ];

  const sampleTableRows = [
    { id: 1, date: "2025-09-10", machine: "Tractor 4WD", unit: "Acre", todayProgress: 5, note: "Completed initial ploughing" },
    { id: 2, date: "2025-09-12", machine: "Tractor 2WD", unit: "Acre", todayProgress: 3, note: "Ongoing task" },
  ];

  return (
    <Box>
      {/* Header + Breadcrumbs */}
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {landId} Progress Overview
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" >
          <Link
            component={RouterLink}
            to="/manager"
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

      {/* Cycle Info */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: 3,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">CYCLE 1</Typography>
        <Typography variant="body2" color="text.secondary">Start Date: 2025 Aug 06</Typography>
        <Typography variant="body2" color="text.secondary">Estimated End Date: 2025 Dec 07</Typography>
        <Typography variant="body2" color="green" fontWeight="bold">STATUS: IN PROGRESS</Typography>
      </Box>

      {/* Task List */}
      <Paper elevation={3} sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          {tasks.map((task) => (
            <Paper key={task.id} sx={{ p: 2, borderRadius: 2 }} elevation={1}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar>{task.name.charAt(0)}</Avatar>
                  <Typography variant="body1">{task.name}</Typography>
                </Box>
                <Box sx={{ flex: 1, mx: 3 }}>
                  <LinearProgress
                    variant="determinate"
                    value={task.progress}
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 40 }}>{task.progress}%</Typography>
                <IconButton onClick={() => toggleExpand(task.id)}>
                  {expandedTaskId === task.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              {/* Collapse DataGrid */}
              <Collapse in={expandedTaskId === task.id} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2 }}>
                  <DataGrid
                    autoHeight
                    rows={sampleTableRows}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                    disableRowSelectionOnClick
                    sx={{
                      backgroundColor: "white",
                      "& .MuiDataGrid-columnHeaders": { backgroundColor: "white", fontWeight: "bold" },
                      "& .MuiDataGrid-columnHeaderTitle": { display: "flex", justifyContent: "center", textAlign: "center", width: "100%" },
                      "& .MuiDataGrid-cell": { textAlign: "center" },
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                      gap: 2,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Left side: Manager Approvals */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="body2" fontWeight="bold">Manager's Approvals:</Typography>
                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select value="Approved" disabled>
                          <MenuItem value="Approved">Approved</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {/* Right side: Done Button */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button variant="contained" color="success" disabled>
                        Done
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
