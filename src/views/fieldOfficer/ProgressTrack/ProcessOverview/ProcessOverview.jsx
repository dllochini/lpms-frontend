import React, { useState, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import TaskTable from "../TaskTable/TaskTable.jsx";
import AddOperationDialog from "./AddOperationDialog.jsx";
import ConfirmDialog from "../ConfirmDialog.jsx";
import ErrorDialog from "../ErrorDialog.jsx";

import { useCreateTask, useDeleteTask } from "../../../../hooks/task.hooks.js";
import { useUpdateProcessById, useDeleteProcess } from "../../../../hooks/process.hook.js";
import { useGetOperations } from "../../../../hooks/operation.hook.js";
import { useGetResources } from "../../../../hooks/resource.hook.js";

const defaultForm = {
  operation: "",
  machine: "",
  startDate: "",
  expectedEndDate: "",
  unit: "Acre",
  estimatedWork: 0,
  note: "",
};

const ProcessOverview = ({ process, onDeleted }) => {
  const { startedDate, endDate } = process || {};

  // Optimistic state
  const [optimisticAddedTasks, setOptimisticAddedTasks] = useState([]);
  const [optimisticDeletedIds, setOptimisticDeletedIds] = useState(new Set());
  const optimisticRef = useRef(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [localStatus, setLocalStatus] = useState(process?.status ?? "In Progress");

  // Dialog states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleteProcessConfirmOpen, setDeleteProcessConfirmOpen] = useState(false);
  const [deletedLocally, setDeletedLocally] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");

  // Operations & Resources
  const { data: operations = [], isLoading: loadingOperations } = useGetOperations();
  const { data: resources = [], isLoading: loadingResources } = useGetResources();

  // Mutations
  const { mutate: updateProcessStatus, isLoading: updatingStatusLoading } = useUpdateProcessById({
    onSuccess: updatedProcess => {
      const newStatus = updatedProcess?.status ?? "Sent for Payment Approval";
      if (newStatus !== localStatus) setLocalStatus(newStatus);
    },
    onError: err => console.error("Failed to update process status:", err),
  });

  const { mutate: createTask, isLoading: creatingTask } = useCreateTask({
    onSuccess: createdTask => {
      if (optimisticRef.current) {
        setOptimisticAddedTasks(prev =>
          prev.map(t => t._id === optimisticRef.current ? createdTask : t)
        );
        optimisticRef.current = null;
      } else if (createdTask) {
        setOptimisticAddedTasks(prev => [...prev, createdTask]);
      }
      setForm(defaultForm);
      setOpenDialog(false);
    },
    onError: err => {
      if (optimisticRef.current) {
        setOptimisticAddedTasks(prev =>
          prev.filter(t => t._id !== optimisticRef.current)
        );
        optimisticRef.current = null;
      }
      setErrorDialogMessage("Failed to create task. Please try again.");
      setErrorDialogOpen(true);
      console.error("Create task failed:", err);
    },
  });

  const { mutate: deleteTask, isLoading: deletingTask } = useDeleteTask();
  const { mutate: deleteProcess, isLoading: deletingProcess } = useDeleteProcess();

  // Derived displayed tasks
  const displayedTasks = useMemo(() => {
    const serverTasks = process?.tasks ?? [];
    return [
      ...serverTasks.filter(t => !optimisticDeletedIds.has(t._id ?? t.id)),
      ...optimisticAddedTasks,
    ];
  }, [process, optimisticAddedTasks, optimisticDeletedIds]);

  const anySentForApproval = useMemo(() => {
  return displayedTasks.some(task => {
    const statusStr = String(task?.status ?? "").toLowerCase().trim();
    return statusStr === "sent for approval";
  });
}, [displayedTasks]);


const normalizedStatus = useMemo( () => String(localStatus ?? "").toLowerCase(), [localStatus]);


  if (deletedLocally) return null;

  // Handlers
  const requestDeleteTask = taskId => {
    setPendingDeleteId(taskId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return setDeleteConfirmOpen(false);

    setOptimisticDeletedIds(prev => new Set(prev).add(pendingDeleteId));
    setDeleteConfirmOpen(false);

    deleteTask(
      { taskId: pendingDeleteId },
      {
        onError: () => {
          setOptimisticDeletedIds(prev => {
            const s = new Set(prev);
            s.delete(pendingDeleteId);
            return s;
          });
          setErrorDialogMessage("Failed to delete task. Please try again.");
          setErrorDialogOpen(true);
        },
        onSuccess: () => setPendingDeleteId(null),
      }
    );
  };

  const handleConfirmDeleteProcess = () => {
    if (!process?._id) return setDeleteProcessConfirmOpen(false);

    setDeletedLocally(true);
    setDeleteProcessConfirmOpen(false);

    deleteProcess(
      { processId: process._id },
      {
        onSuccess: () => {
          if (onDeleted) onDeleted(process._id);
        },
        onError: () => {
          setDeletedLocally(false);
          setErrorDialogMessage("Failed to delete process. Please try again.");
          setErrorDialogOpen(true);
        },
      }
    );
  };

  const handleProcessCompletion = () => {
    if (!process?._id) return;

    setLocalStatus("Sent for Payment Approval");

    updateProcessStatus({
      processId: process._id,
      updatedData: { status: "Sent for Payment Approval", endDate: new Date().toISOString() },
    });
  };

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => { setForm(defaultForm); setOpenDialog(false); };
  const handleFormChange = e => { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); };

  const handleAddTask = () => {
    if (creatingTask) return;

    const startMs = Date.parse(form.startDate);
    const endMs = Date.parse(form.expectedEndDate);

    if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
      setErrorDialogMessage("Please provide valid Start Date and Expected End Date.");
      setErrorDialogOpen(true);
      return;
    }
    if (startMs > endMs) {
      setErrorDialogMessage("Start Date cannot be after Expected End Date.");
      setErrorDialogOpen(true);
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const userId = localStorage.getItem("loggedUserId") || undefined;
    const optimisticTask = {
      _id: tempId,
      id: tempId,
      assignedTo: userId,
      process: process?._id,
      operation: form.operation,
      startDate: form.startDate,
      expectedEndDate: form.expectedEndDate,
      estTotalWork: form.estimatedWork,
      status: "In Progress",
      progress: 0,
      note: form.note,
    };

    optimisticRef.current = tempId;
    setOptimisticAddedTasks(prev => [...prev, optimisticTask]);

    createTask({
      operation: form.operation,
      resource: form.machine,
      assignedTo: userId,
      process: process?._id,
      startDate: new Date(startMs).toISOString(),
      expectedEndDate: new Date(endMs).toISOString(),
      estTotalWork: String(form.estimatedWork ?? ""),
      note: form.note || "",
      status: "In Progress",
    });

    if ((process?.status ?? "").toLowerCase().trim() === "not started") {
      setLocalStatus("In Progress");
      updateProcessStatus({
        processId: process._id,
        updatedData: { status: "In Progress", startedDate: new Date().toISOString() },
      });
    }

    setForm(defaultForm);
    setOpenDialog(false);
  };

  const allowed = ["in progress", "not started"];

  return (
    <>
      <Paper elevation={3} sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 3, mt: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mx: 3, my: 2 }}>
          <Typography variant="body2" color="text.secondary">Start Date: {startedDate || "-"}</Typography>
          <Typography variant="body2" color="text.secondary">End Date: {endDate || "-"}</Typography>
          <Typography variant="body2" color="green" fontWeight="bold">STATUS: {localStatus || "-"}</Typography>
        </Box>

        <Stack spacing={0.5}>
          {displayedTasks.length === 0 ? (
            <Typography color="text.secondary" sx={{ px: 5 }}>No tasks for this process yet.</Typography>
          ) : (
            displayedTasks.map((task, idx) => (
              <TaskTable
                key={task._id ?? task.id ?? idx}
                task={task}
                onTaskStatusChange={() => {}}
                onDeleteTask={requestDeleteTask}
              />
            ))
          )}
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setDeleteProcessConfirmOpen(true)}
            disabled={deletingProcess || updatingStatusLoading || process?.status !== "Not Started"}
            startIcon={<DeleteForeverIcon />}
          >
            DELETE
          </Button>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleDialogOpen}
              disabled={anySentForApproval || creatingTask || !allowed.includes(normalizedStatus)}
            >
              ADD NEW OPERATION
            </Button>

            <Button
              variant="outlined"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleProcessCompletion}
              disabled={updatingStatusLoading || normalizedStatus !== "in progress"}
            >
              DONE
            </Button>
          </Box>
        </Box>
      </Paper>

      <AddOperationDialog
        open={openDialog}
        onClose={handleDialogClose}
        onSubmit={handleAddTask}
        form={form}
        onChange={handleFormChange}
        creatingTask={creatingTask}
        anySentForApproval={anySentForApproval}
        operations={operations}
        resources={resources}
        loadingOperations={loadingOperations}
        loadingResources={loadingResources}
      />

      <ConfirmDialog
        open={deleteProcessConfirmOpen}
        onClose={() => setDeleteProcessConfirmOpen(false)}
        onConfirm={handleConfirmDeleteProcess}
        title="Confirm Delete Process"
        message="Are you sure you want to delete this process and all of its tasks/progress? This action cannot be undone."
        subMessage={`Tasks affected: ${displayedTasks.length}`}
        confirmLabel="Delete"
        loading={deletingProcess}
        confirmColor="error"
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        loading={deletingTask}
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

ProcessOverview.propTypes = {
  process: PropTypes.shape({
    _id: PropTypes.string,
    startedDate: PropTypes.string,
    endDate: PropTypes.string,
    status: PropTypes.string,
    tasks: PropTypes.array,
  }).isRequired,
  onDeleted: PropTypes.func,
};

export default ProcessOverview;
