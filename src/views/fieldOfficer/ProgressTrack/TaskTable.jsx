// TaskTable.jsx
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgressWithLabel from "./circularProgressWithLabel";
import { useUpdateTask } from "../../../hooks/task.hooks";
import {
  useCreateWorkDone,
  useDeleteWorkDone,
} from "../../../hooks/workdone.hooks";
import ConfirmDialog from "./ConfirmDialog";
import AddProcessDialog from "./AddTaskDialog";
import AddTaskDialog from "./AddTaskDialog";
import ErrorDialog from "./ErrorDialog";

const TaskTable = ({ task = {}, onTaskStatusChange, onDeleteTask }) => {
  const taskKey = task._id ?? task.id ?? null;

  // UI state
  const [expandedTaskId, setExpand] = useState(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [localStatus, setLocalStatus] = useState(task?.status ?? "In Progress");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // after: const statusValue = String(localStatus ?? "Pending").toLowerCase();

  const [workDones, setWorkDones] = useState(
    Array.isArray(task?.workDones) ? task.workDones : []
  );
  const optimisticRef = useRef(null);

  useEffect(() => {
    if (task?.status && task.status !== localStatus) {
      setLocalStatus(task.status);
    }
    setWorkDones(Array.isArray(task?.workDones) ? task.workDones : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.status, task?.workDones]);

  const { mutate: updateTaskStatus, isLoading: updatingStatusLoading } =
    useUpdateTask({
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

  const { mutate: createWorkDone, isLoading: creatingWorkDone } = useCreateWorkDone();

  // delete workDone hook (assumed react-query style)
  const { mutate: deleteWorkDone, isLoading: deletingWorkDone } = useDeleteWorkDone();

  const [taskForm, setTaskForm] = useState({
    startDate: "",
    endDate: "",
    unit: "",
    workDone: 0,
    note: "",
  });

  // confirm dialog for deleting the whole task (Task-level confirmation)
  const [deleteTaskConfirmOpen, setDeleteTaskConfirmOpen] = useState(false);
  const statusValue = String(localStatus ?? "Pending").toLowerCase();
  const isEditable =
    task?.done ||
    statusValue !== "in progress" ||
    updatingStatus ||
    updatingStatusLoading;

  const handleRequestDeleteTask = () => {
    setDeleteTaskConfirmOpen(true);
  };

  const handleConfirmDeleteTask = () => {
    setDeleteTaskConfirmOpen(false);
    if (typeof onDeleteTask === "function") {
      onDeleteTask(taskKey);
    }
  };

  // delete confirmation dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteRow, setPendingDeleteRow] = useState(null);
  // error dialog state
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");

  const columns = [
    {
      field: "id",
      headerName: "No",
      flex: 0.3,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "startDate",
      headerName: "Started Time",
      flex: 0.8,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "endDate",
      headerName: "End Time",
      flex: 0.8,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "newWork",
      headerName: `Work Done (${task?.resource?.unit?.name ?? ""})`,
      flex: 0.7,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "notes",
      headerName: "Notes",
      flex: 1.2,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <IconButton
            size="small"
            onClick={() => handleRequestDelete(params.row)}
            disabled={creatingWorkDone || deletingWorkDone || isEditable}
            aria-label="delete-workdone"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        );
      },
    },
  ];

  const handleTaskDialogOpen = (taskObj) => {
    setSelectedTask(taskObj);
    setTaskForm({
      startDate: "",
      endDate: "",
      unit: taskObj?.resource?.unit?.name ?? "Acre",
      workDone: 0,
      note: "",
    });
    setTaskDialogOpen(true);
  };

  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTaskRow = () => {
    if (!selectedTask || selectedTask.done) return;
    if (creatingWorkDone) return;

    const payload = {
      task: selectedTask?._id || selectedTask?.id,
      startDate: taskForm.startDate ? new Date(taskForm.startDate).toISOString() : undefined,
      endDate: taskForm.endDate ? new Date(taskForm.endDate).toISOString() : undefined,
      newWork: Number(taskForm.workDone) || 0,
      notes: taskForm.note || "",
    };

    const tempId = `temp-${Date.now()}`;
    const optimisticEntry = {
      id: tempId,
      startDate: payload.startDate,
      endDate: payload.endDate,
      newWork: payload.newWork,
      notes: payload.notes,
      optimistic: true,
    };

    optimisticRef.current = optimisticEntry.id;
    setWorkDones((prev) => [...prev, optimisticEntry]);

    setTaskDialogOpen(false);
    setSelectedTask(null);
    setTaskForm({
      startDate: "",
      endDate: "",
      unit: task?.resource?.unit?.name ?? "Acre",
      workDone: 0,
      note: "",
    });

    createWorkDone(payload, {
      onSuccess: (res) => {
        const created = res?.data ?? res;

        setWorkDones((prev) => {
          if (optimisticRef.current != null) {
            return prev.map((w) =>
              w.id === optimisticRef.current
                ? {
                  id: created.id ?? created._id ?? w.id,
                  startDate:
                    created.startDate ?? payload.startDate ?? w.startDate,
                  endDate: created.endDate ?? payload.endDate ?? w.endDate,
                  newWork:
                    created.newWork ??
                    created.workDone ??
                    payload.newWork ??
                    w.newWork,
                  notes:
                    created.notes ?? created.note ?? payload.notes ?? w.notes,
                  __raw: created,
                } : w);
          }
          return [
            ...prev,
            {
              id: created.id ?? created._id ?? `srv-${Date.now()}`,
              startDate: created.startDate ?? payload.startDate,
              endDate: created.endDate ?? payload.endDate,
              newWork: created.newWork ?? created.workDone ?? payload.newWork,
              notes: created.notes ?? created.note ?? payload.notes,
              __raw: created,
            },
          ];
        });

        optimisticRef.current = null;
      },
      onError: (err) => {
        setWorkDones((prev) =>
          prev.filter((w) => w.id !== optimisticRef.current)
        );
        optimisticRef.current = null;
        console.error("Failed to create workDone:", err);
        setErrorDialogMessage("Failed to add progress. Please try again.");
        setErrorDialogOpen(true);
      },
    });
  };

  const handleTaskDialogClose = () => {
    setTaskDialogOpen(false);
    setSelectedTask(null);
  };

  const handleRequestDelete = (row) => {
    setPendingDeleteRow(row);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteRow) {
      setDeleteConfirmOpen(false);
      return;
    }

    const row = pendingDeleteRow;
    const prev = workDones;

    if (String(row.id).startsWith("temp-") || row.optimistic) {
      setWorkDones((p) => p.filter((w) => w.id !== row.id));
      setPendingDeleteRow(null);
      setDeleteConfirmOpen(false);
      return;
    }

    const serverId = row.__raw?.id ?? row.__raw?._id ?? row.id;

    setWorkDones((p) => p.filter((w) => w.id !== row.id));
    setDeleteConfirmOpen(false);

    deleteWorkDone(
      { workId: serverId },
      {
        onSuccess: () => {
          setPendingDeleteRow(null);
        },
        onError: (err) => {
          setWorkDones(prev);
          setPendingDeleteRow(null);
          console.error("Failed to delete workDone:", err);
          setErrorDialogMessage("Failed to delete progress. Please try again.");
          setErrorDialogOpen(true);
        },
      }
    );
  };

  // map workDones to rows for DataGrid; display readable date (YYYY-MM-DD) if ISO provided
  const getRowsForWorkDones = (list = []) =>
    (Array.isArray(list) ? list : []).map((work, index) => {
      const format = (d) => {
        if (!d) return "-";
        try {
          return String(d).includes("T") ? String(d).slice(0, 10) : String(d);
        } catch (e) {
          return String(d);
        }
      };
      return {
        id: work.id ?? work._id ?? `r-${index + 1}`,
        startDate: work.startDate ? format(work.startDate) : "-",
        endDate: work.endDate ? format(work.endDate) : "-",
        newWork: work.newWork ?? 0,
        notes: work.notes ?? work.note ?? "-",
        __raw: work,
      };
    });

  const handleMarkSentForApproval = () => {
    if (!taskKey) return;
    if (updatingStatusLoading || updatingStatus) return;

    setUpdatingStatus(true);
    setLocalStatus("Sent for approval");

    updateTaskStatus(
      {
        taskId: taskKey,
        updatedData: {
          status: "Sent for approval",
          endDate: new Date().toISOString(),
        },
      },
      { onSettled: () => { setUpdatingStatus(false); } }
    );
  };

  const calculateTaskProgress = (workDones = [], estTotalWork = 1) => {
  const totalDone = workDones.reduce((sum, w) => sum + Number(w.newWork || 0), 0);
  return Math.min((totalDone / (Number(estTotalWork) || 1)) * 100, 100);
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
            py: 1,
            borderBottom: "1px solid #eee",
          }}
        >
          {/* Left Section — Operation & Machine */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
              <Typography variant="body1" fontWeight={600}>
                {task?.operation?.name ?? "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {task?.resource?.name ?? "-"} • Unit:{" "}
                {task?.resource?.unit?.name ?? "-"}
              </Typography>
            </Box>
          </Box>

          {/* Middle Section — Total Work */}
          <Box
            sx={{
              minWidth: 150,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              mr: 3,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Total Estimated Work
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {task?.estTotalWork ?? 0} {task?.resource?.unit?.name ?? ""}
            </Typography>
          </Box>

          {/* Right Section — Progress */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              justifyContent: "center",
              minWidth: 150,
            }}
          >
            <CircularProgressWithLabel
              size={50}
              value={calculateTaskProgress(workDones, task?.estTotalWork)}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {calculateTaskProgress(workDones, task?.estTotalWork).toFixed(1)}%
              </Typography>
            </Box>
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
              rows={getRowsForWorkDones(workDones)}
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
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box
                  sx={{ display: "flex", flex:1, justifyContent: "flex-start" }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRequestDeleteTask}
                    disabled={isEditable}
                  >
                    Delete Operation
                  </Button>
                </Box>
                <Box sx={{ gap: 1, flex:1, display: "flex", justifyContent: "flex-end  " }}>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleTaskDialogOpen(task)}
                    disabled={isEditable || creatingWorkDone}
                  >

                    Add New Progress
                  </Button>

                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleMarkSentForApproval}
                    disabled={task?.done || statusValue !== "in progress" || updatingStatus}
                  >
                    {updatingStatus ? "Sending..." : "Done"}
                  </Button>
                </Box>
              </Box>

            </Box>
          </Box>
        </Collapse>
      </Paper>

      <AddTaskDialog
        open={taskDialogOpen}
        onClose={handleTaskDialogClose}
        onSubmit={handleAddTaskRow}
        taskForm={taskForm}
        onFormChange={handleTaskFormChange}
        selectedTask={selectedTask}
        creatingWorkDone={creatingWorkDone}
      />

      {/* Confirm delete progress entry */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this progress entry? This action cannot be undone."
        confirmLabel="Delete"
        loading={deletingWorkDone} // ✅ correct loading flag
        confirmColor="error"
      />

      {/* Confirm delete entire operation/task */}
      <ConfirmDialog
        open={deleteTaskConfirmOpen}
        onClose={() => setDeleteTaskConfirmOpen(false)}
        onConfirm={handleConfirmDeleteTask}
        title="Confirm Delete Task"
        message="Are you sure you want to delete this entire operation? This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="error"
      />


      <ErrorDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        message={errorDialogMessage}
      />
    </>
  );
};

TaskTable.propTypes = {
  task: PropTypes.object,
  onTaskStatusChange: PropTypes.func,
  onDeleteTask: PropTypes.func, // delete whole task
};

export default TaskTable;
