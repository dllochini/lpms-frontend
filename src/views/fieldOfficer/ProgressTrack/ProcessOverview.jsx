// ProcessOverview.jsx
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TaskTable from "./TaskTable";
import { useGetResources } from "../../../hooks/resource.hook.js";
import { useGetOperations } from "../../../hooks/operation.hook.js";
import { useCreateTask } from "../../../hooks/task.hooks.js";

const defaultForm = {
  operation: "",
  machine: "",
  startDate: "",
  expectedEndDate: "",
  unit: "Acre",
  estimatedWork: 0,
  note: "",
};

const ProcessOverview = ({ process }) => {
  const { startedDate, endDate, status } = process || {};
  const [tasks, setTasks] = useState(process?.tasks ? [...process.tasks] : []);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const optimisticRef = useRef(null);

  
    const isAnyTaskPendingApproval = tasks.some(t => t.status === "Sent for approval");

  useEffect(() => {
    setTasks(process?.tasks ? [...process.tasks] : []);
  }, [process]);

  const { data: resources = [], isLoading: loadingResources } =
    useGetResources();
  const { data: operations = [], isLoading: loadingOperations } =
    useGetOperations();

  // createTask hook (your implementation)
  const { mutate: createTask, isLoading: creatingTask } = useCreateTask({
    onSuccess: (createdTask) => {
      if (optimisticRef.current) {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === optimisticRef.current || t.id === optimisticRef.current
              ? createdTask
              : t
          )
        );
        optimisticRef.current = null;
      } else if (createdTask) {
        setTasks((prev) => [...prev, createdTask]);
      }
      setForm(defaultForm);
      setOpenDialog(false);
    },
    onError: (err) => {
      if (optimisticRef.current) {
        setTasks((prev) =>
          prev.filter(
            (t) =>
              t._id !== optimisticRef.current && t.id !== optimisticRef.current
          )
        );
        optimisticRef.current = null;
      }
      console.error("Create task failed:", err);
    },
  });

  // Called by TaskTable when a task's status changes (server confirmed)
  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId || t.id === taskId ? { ...t, status: newStatus } : t
      )
    );
  };

  // disable adding new operations while any task is "Sent for approval"
  const anySentForApproval = tasks.some(
    (t) =>
      String(t?.status ?? "")
        .toLowerCase()
        .trim() === "sent for approval".toLowerCase()
  );

  const handleDialogOpen = () => {
    setForm(defaultForm);
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setForm(defaultForm);
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = () => {
    if (creatingTask) return;
    // minimal validation
    if (!form.operation || !form.machine || !form.startDate || !form.expectedEndDate) {
      alert("Please fill operation, machine, start date and expected end date.");
      return;
    }

    const userId = localStorage.getItem("loggedUserId") || undefined;
    const processId = process?._id ?? process?.id;

    const payload = {
      operation: form.operation,
      resource: form.machine,
      assignedTo: userId,
      process: processId,
      startDate: new Date(form.startDate).toISOString(),
      expectedEndDate: new Date(form.expectedEndDate).toISOString(),
      estTotalWork: String(form.estimatedWork ?? ""),
      note: form.note || "",
      status: "In Progress",
    };

    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      _id: tempId,
      id: tempId,
      assignedTo: userId,
      process: processId,
      operation:
        operations.find((o) => o._id === form.operation) || {
          _id: form.operation,
          name: form.operation,
        },
      resource:
        resources.find((r) => r._id === form.machine) || {
          _id: form.machine,
          name: form.machine,
          unit: { name: form.unit || "Acre", symbol: "" },
        },
      name:
        operations.find((o) => o._id === form.operation)?.name ||
        `Operation ${form.operation}`,
      startDate: payload.startDate,
      expectedEndDate: payload.expectedEndDate,
      estTotalWork: payload.estTotalWork,
      status: payload.status,
      progress: 0,
      done: false,
      approval: "Pending",
      note: payload.note,
      workDones: [],
    };

    optimisticRef.current = tempId;
    setTasks((prev) => [...prev, optimisticTask]);
    console.log("Creating task payload:", payload);
    createTask(payload);
    setForm(defaultForm);
    setOpenDialog(false);
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: 3,
          my: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {/* optional */}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start Date: {startedDate || "-"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Estimated End Date: {endDate || "-"}
        </Typography>
        <Typography variant="body2" color="green" fontWeight="bold">
          STATUS: {status || "-"}
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 3 }}
      >
        <Stack spacing={0.5}>
          {tasks.length === 0 ? (
            <Typography color="text.secondary">
              No tasks for this process yet.
            </Typography>
          ) : (
            tasks.map((task, idx) => (
              <TaskTable
                key={task._id ?? task.id ?? idx}
                task={task}
                onTaskStatusChange={handleTaskStatusChange}
              />
            ))
          )}
        </Stack>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
        >
          {status !== "Done" && (
            <>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleDialogOpen}
                disabled={anySentForApproval || creatingTask}
              >
                ADD NEW OPERATION
              </Button>

              <Button
                variant="outlined"
                color="success"
                startIcon={<CheckCircleIcon />}
              >
                DONE
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3, p: 1.5 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            textAlign: "center",
            fontSize: "1.2rem",
            color: "primary.main",
          }}
        >
          Add New Operation
        </DialogTitle>

        <DialogContent dividers sx={{ py: 3 }}>
          <Box
            component="form"
            id="add-operation-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTask();
            }}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl fullWidth>
              <InputLabel id="operation-label">Operation</InputLabel>
              <Select
                name="operation"
                labelId="operation-label"
                value={form.operation}
                onChange={handleFormChange}
                label="Operation"
              >
                {loadingOperations ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : operations.length === 0 ? (
                  <MenuItem disabled>No operations found</MenuItem>
                ) : (
                  operations.map((op) => (
                    <MenuItem key={op._id} value={op._id}>
                      {op.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="machine-label">Machine</InputLabel>
              <Select
                name="machine"
                labelId="machine-label"
                value={form.machine}
                onChange={handleFormChange}
                label="Machine"
              >
                {loadingResources ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : resources.length === 0 ? (
                  <MenuItem disabled>No machines found</MenuItem>
                ) : (
                  resources.map((res) => (
                    <MenuItem key={res._id} value={res._id}>
                      {res.name} ({res.unit?.symbol || "-"})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Expected End Date"
                type="date"
                name="expectedEndDate"
                value={form.expectedEndDate}
                onChange={handleFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <TextField
              label="Estimated Work"
              name="estimatedWork"
              type="number"
              value={form.estimatedWork ?? ""}
              onChange={handleFormChange}
              fullWidth
              inputProps={{ min: 0 }}
            />

            <TextField
              label="Note"
              name="note"
              value={form.note}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={handleDialogClose}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none" }}
            disabled={isAnyTaskPendingApproval} // disable cancel if needed
          >
            Cancel
          </Button>

          <Button
            form="add-operation-form"
            type="submit"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
            disabled={creatingTask || isAnyTaskPendingApproval} // disable if creating or pending approval
          >
            {creatingTask ? "Starting..." : "Start Operation"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ProcessOverview.propTypes = {
  process: PropTypes.shape({
    startedDate: PropTypes.string,
    endDate: PropTypes.string,
    status: PropTypes.string,
    tasks: PropTypes.array,
  }).isRequired,
};

export default ProcessOverview;
