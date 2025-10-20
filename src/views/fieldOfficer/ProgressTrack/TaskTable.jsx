// TaskTable.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgressWithLabel from "./circularProgressWithLabel";
import { useUpdateTask } from "../../../hooks/task.hooks";

const TaskTable = ({ task = {}, onTaskStatusChange }) => {
  const taskKey = task._id ?? task.id ?? null;
  const [expandedTaskId, setExpand] = useState(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [localStatus, setLocalStatus] = useState(task?.status ?? "In Progress");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  
  const { mutate: updateTaskStatus, isLoading: updatingStatusLoading } = useUpdateTask({
    onSuccess: (updatedTask) => {
      const newStatus = updatedTask?.status ?? "Sent for approval";
      setLocalStatus(newStatus);
      if (typeof onTaskStatusChange === "function") {
        onTaskStatusChange(taskKey, newStatus);
      }
    },
    onError: (err) => {
      console.error("Failed to update task status:", err);
      setLocalStatus(task?.status ?? "In Progress");
    },
  });

  const [taskForm, setTaskForm] = useState({
    startDate: "",
    endDate: "",
    unit: "",
    workDone: 0,
    note: "",
  });

  // localStatus: keeps immediate UI state (optimistic) and prevents calling .toLowerCase on non-strings

  useEffect(() => {
    if (task?.status && task.status !== localStatus) {
      setLocalStatus(task.status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.status]);

  const statusValue = String(localStatus ?? "Pending").toLowerCase();

  const columns = [
    { field: "id", headerName: "No", flex: 0.3, minWidth: 60, headerAlign: "center", align: "center" },
    { field: "startDate", headerName: "Started Time", flex: 0.8, minWidth: 130, headerAlign: "center", align: "center" },
    { field: "endDate", headerName: "End Time", flex: 0.8, minWidth: 130, headerAlign: "center", align: "center" },
    { field: "newWork", headerName: `Work Done (${task?.resource?.unit?.name ?? ""})`, flex: 0.7, minWidth: 120, headerAlign: "center", align: "center" },
    { field: "notes", headerName: "Notes", flex: 1.2, minWidth: 200, headerAlign: "center", align: "center" },
  ];

  const handleTaskDialogOpen = (taskObj) => {
    setSelectedTask(taskObj);
    setTaskForm({ startDate: "", endDate: "", unit: "Acre", workDone: 0, note: "" });
    setTaskDialogOpen(true);
  };

  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTaskRow = () => {
    if (!selectedTask || selectedTask.done) return;

    const payload = {
      task: selectedTask?._id || selectedTask?.id,
      startDate: taskForm.startDate ? new Date(taskForm.startDate).toISOString() : undefined,
      endDate: taskForm.endDate ? new Date(taskForm.endDate).toISOString() : undefined,
      newWork: Number(taskForm.workDone) || 0,
      notes: taskForm.note || "",
    };

    // TODO: call your createWorkDone mutation here. This file demonstrates status handling.
    console.log("Would create WorkDone payload:", payload);
  };

  const handleTaskDialogClose = () => {
    setTaskDialogOpen(false);
    setSelectedTask(null);
  };

  // Safe getRowsForTask: never call map on undefined
  const getRowsForTask = (taskObj = {}) => {
    const rows = Array.isArray(taskObj.workDones) ? taskObj.workDones : [];
    return rows.map((work, index) => ({
      id: work._id ?? work.id ?? `${taskKey ?? "t"}-row-${index + 1}`,
      startDate: work?.startDate ?? "-",
      endDate: work?.endDate ?? "-",
      newWork: work?.newWork ?? 0,
      notes: work?.notes ?? "-",
    }));
  };

  const handleMarkSentForApproval = () => {
    if (!taskKey) return;
    // prevent double clicks while request in flight
    if (updatingStatusLoading || updatingStatus) return;

    // optimistic UI
    setUpdatingStatus(true);
    setLocalStatus("Sent for approval");

    // call mutation; mutate accepts (variables, options)
    updateTaskStatus(
      { taskId: taskKey, updatedData: { status: "Sent for approval" } },
      {
        onSettled: () => {
          setUpdatingStatus(false);
        },
      }
    );
  };

  return (
    <>
      <Paper sx={{ p: 2, borderRadius: 2 }} elevation={1}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography variant="body1" fontWeight={600}>
                {task?.operation?.name ?? "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {task?.resource?.name ?? "-"} • Unit:{" "}
                {task?.resource?.unit?.name ?? "-"}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              mx: 4,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgressWithLabel value={Number(task?.progress ?? 10)} />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              minWidth: 180,
              justifyContent: "flex-end",
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              Status: {localStatus}
            </Typography>

            <IconButton
              onClick={() =>
                setExpand(expandedTaskId === taskKey ? null : taskKey)
              }
            >
              {expandedTaskId === taskKey ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expandedTaskId === taskKey} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <DataGrid
              autoHeight
              rows={getRowsForTask(task)}
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
              {/* disable add progress and done if status is "sent for approval" */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleTaskDialogOpen(task)}
                  disabled={task?.done || statusValue === "sent for approval"}
                >
                  Add New Progress
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  onClick={handleMarkSentForApproval}
                  disabled={
                    task?.done ||
                    statusValue === "sent for approval" ||
                    updatingStatus
                  }
                >
                  {updatingStatus ? "Sending..." : "Done"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Paper>

      <Dialog
        open={taskDialogOpen}
        onClose={handleTaskDialogClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3, p: 1.5 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            textAlign: "center",
            fontSize: "1.3rem",
            color: "primary.main",
          }}
        >
          Add New Progress
        </DialogTitle>

        <DialogContent dividers sx={{ py: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Operation:
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedTask?.operation?.name || "-"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flex: "1 1 45%",
                    minWidth: 140,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Machine:
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedTask?.resource?.name || "-"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flex: "1 1 45%",
                    minWidth: 120,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Unit:
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedTask?.resource?.unit?.name || "-"}(
                    {selectedTask?.resource?.unit?.symbol || "-"})
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                name="startDate"
                value={taskForm.startDate}
                onChange={handleTaskFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                name="endDate"
                value={taskForm.endDate}
                onChange={handleTaskFormChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <TextField
              label={`Work Done (${task?.resource?.unit?.name ?? ""})`}
              type="number"
              name="workDone"
              value={taskForm.workDone}
              onChange={handleTaskFormChange}
              fullWidth
            />

            <TextField
              label="Note"
              name="note"
              value={taskForm.note}
              onChange={handleTaskFormChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
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
            onClick={handleTaskDialogClose}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddTaskRow}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Add Progress
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

TaskTable.propTypes = {
  task: PropTypes.object,
  onTaskStatusChange: PropTypes.func,
};

export default TaskTable;
