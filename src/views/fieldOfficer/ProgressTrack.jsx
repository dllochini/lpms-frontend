
import React, { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Link as RouterLink } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

export default function ProgressTrack() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Bush Clearing", progress: 100, done: false },
    { id: 2, name: "Ploughing", progress: 50, done: false },
  ]);

  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [form, setForm] = useState({
    operation: "",
    machine: "",
    startDate: "",
    endDate: "",
    unit: "Acre",
    workDone: 0,
    note: "",
  });

  const [sampleTableRowsByTask, setSampleTableRowsByTask] = useState({});

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    machine: "",
    startDate: "",
    endDate: "",
    unit: "Acre",
    workDone: 0,
    note: "",
  });

  const columns = [
    { field: "id", headerName: "Task ID", width: 120, headerAlign: "center", align: "center" },
    { field: "date", headerName: "Date", width: 150, headerAlign: "center", align: "center" },
    { field: "machine", headerName: "Type of Machine", width: 180, headerAlign: "center", align: "center" },
    { field: "unit", headerName: "Unit of Measure", width: 140, headerAlign: "center", align: "center" },
    { field: "todayProgress", headerName: "Today Progress", width: 150, headerAlign: "center", align: "center" },
    { field: "note", headerName: "Note", width: 220, headerAlign: "center", align: "center" },
  ];

  const toggleExpand = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      name: form.operation || `Task ${tasks.length + 1}`,
      progress: 0,
      done: false,
    };
    setTasks([...tasks, newTask]);
    setOpenDialog(false);
  };

  const handleTaskDialogOpen = (task) => {
    setSelectedTask(task);
    setTaskForm({
      machine: "",
      startDate: "",
      endDate: "",
      unit: "Acre",
      workDone: 0,
      note: "",
    });
    setTaskDialogOpen(true);
  };

  const handleTaskDialogClose = () => {
    setTaskDialogOpen(false);
    setSelectedTask(null);
  };

  const handleTaskFormChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleAddTaskRow = () => {
    if (!selectedTask || selectedTask.done) return;

    const newRow = {
      id: Date.now(),
      date: taskForm.startDate || new Date().toISOString().split("T")[0],
      machine: taskForm.machine || "-",
      unit: taskForm.unit || "Acre",
      todayProgress: Number(taskForm.workDone) || 0,
      note: taskForm.note || "",
    };

    setSampleTableRowsByTask((prev) => {
      const copy = { ...prev };
      const existing = Array.isArray(copy[selectedTask.id]) ? copy[selectedTask.id] : [];
      copy[selectedTask.id] = [...existing, newRow];
      return copy;
    });

    setTaskDialogOpen(false);
    setSelectedTask(null);
  };

  const handleMarkTaskDone = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, done: true, progress: 100 } : t
      )
    );
  };

  return (
    <Box>
      {/* Header + Breadcrumbs */}
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          L1324 Progress Overview
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Link
            component={RouterLink}
            to="/"
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
        <Typography variant="subtitle1" fontWeight="bold">
          CYCLE 1
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start Date: 2025 Aug 06
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Estimated End Date: 2025 Dec 07
        </Typography>
        <Typography variant="body2" color="green" fontWeight="bold">
          STATUS: IN PROGRESS
        </Typography>
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
                <Typography variant="body2" sx={{ minWidth: 40 }}>
                  {task.progress}%
                </Typography>
                <IconButton onClick={() => toggleExpand(task.id)}>
                  {expandedTaskId === task.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              {/* Collapse DataGrid */}
              <Collapse in={expandedTaskId === task.id} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2 }}>
                  <DataGrid
                    autoHeight
                    rows={sampleTableRowsByTask[task.id] || []}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    disableRowSelectionOnClick
                    sx={{
                      backgroundColor: "white",
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "white",
                        fontWeight: "bold",
                      },
                      "& .MuiDataGrid-columnHeaderTitle": {
                        display: "flex",
                        justifyContent: "center",
                        textAlign: "center",
                        width: "100%",
                      },
                      "& .MuiDataGrid-cell": {
                        textAlign: "center",
                      },
                    }}
                  />
                  {/* Buttons under the table */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleTaskDialogOpen(task)}
                      disabled={task.done}
                    >
                      Add New Task
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleMarkTaskDone(task.id)}
                      disabled={task.done}
                    >
                      Done
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </Paper>
          ))}
        </Stack>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleDialogOpen}>
            ADD NEW PROGRESS
          </Button>
          <Button variant="outlined" color="success" startIcon={<CheckCircleIcon />}>
            DONE
          </Button>
        </Box>
      </Paper>

      {/* Add New Operation Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Operation</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="dense">
            <InputLabel>Operation</InputLabel>
            <Select name="operation" value={form.operation} onChange={handleFormChange}>
              <MenuItem value="Ploughing">Ploughing</MenuItem>
              <MenuItem value="Bush Clearing">Bush Clearing</MenuItem>
              <MenuItem value="Harrowing">Harrowing</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              sx={{
                borderRadius: "20px",
                px: 3,
                py: 1,
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              ADD NEW OPERATION
            </Button>
          </Box>

          <TextField
            label="Start Date"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Estimate End Date"
            type="date"
            name="estimateEndndDate"
            value={form.endDate}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Note"
            name="note"
            value={form.note}
            onChange={handleFormChange}
            fullWidth
            margin="dense"
            multiline
            rows={3}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddTask} variant="contained" color="primary">
            START OPERATION
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={handleTaskDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Operation"
            value={selectedTask?.name || ""}
            fullWidth
            margin="dense"
            disabled
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Type of Machine</InputLabel>
            <Select name="machine" value={taskForm.machine} onChange={handleTaskFormChange}>
              <MenuItem value="Tractor 4WD">Tractor 4WD (75HP-90HP)</MenuItem>
              <MenuItem value="Tractor 2WD">Tractor 2WD (45HP)</MenuItem>
              <MenuItem value="Tractor 45HP">Tractor 45HP</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Start Date"
            type="date"
            name="startDate"
            value={taskForm.startDate}
            onChange={handleTaskFormChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="End Date"
            type="date"
            name="endDate"
            value={taskForm.endDate}
            onChange={handleTaskFormChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Unit of Measure"
            name="unit"
            value={taskForm.unit}
            onChange={handleTaskFormChange}
            fullWidth
            margin="dense"
          />

          <TextField
            label="Work Done"
            type="number"
            name="workDone"
            value={taskForm.workDone}
            onChange={handleTaskFormChange}
            fullWidth
            margin="dense"
          />

          <TextField
            label="Note"
            name="note"
            value={taskForm.note}
            onChange={handleTaskFormChange}
            fullWidth
            margin="dense"
            multiline
            rows={3}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleTaskDialogClose}>Cancel</Button>
          <Button onClick={handleAddTaskRow} variant="contained" color="primary">
            ADD TASK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


