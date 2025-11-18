import React, { useState, useMemo, useRef, useEffect } from "react";
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
import VisibilityIcon from "@mui/icons-material/Visibility";

import TaskTable from "../TaskTable/TaskTable.jsx";
import AddOperationDialog from "./AddOperationDialog.jsx";
import ConfirmDialog from "../ConfirmDialog.jsx";
import ErrorDialog from "../ErrorDialog.jsx";

import { useCreateTask, useDeleteTask } from "../../../../hooks/task.hooks.js";
import { useUpdateProcessById, useDeleteProcess } from "../../../../hooks/process.hook.js";
import { useGetOperations } from "../../../../hooks/operation.hook.js";
import { useGetResources } from "../../../../hooks/resource.hook.js";
import { useCreateBill, useGetBillByProcess } from "../../../../hooks/bill.hook.js";
import BillDetailDialog from "./BillDetailDialog.jsx";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const { startedDate, endDate } = process || {};

  const [optimisticAddedTasks, setOptimisticAddedTasks] = useState([]);
  const [optimisticDeletedIds, setOptimisticDeletedIds] = useState(new Set());
  const optimisticRef = useRef(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [localStatus, setLocalStatus] = useState(process?.status ?? "In Progress");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleteProcessConfirmOpen, setDeleteProcessConfirmOpen] = useState(false);
  const [deletedLocally, setDeletedLocally] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");

  const [currentBill, setCurrentBill] = useState(null);
  const [openBillPreview, setOpenBillPreview] = useState(false);
  const prevShowApprovedRef = useRef(false);

  const { data: operations = [], isLoading: loadingOperations } = useGetOperations();
  const { data: resources = [], isLoading: loadingResources } = useGetResources();

  const { mutate: updateProcessStatus, isLoading: updatingStatusLoading } = useUpdateProcessById({
    onSuccess: updatedProcess => {
      const newStatus = updatedProcess?.status ?? "Sent for Payment Approval";
      if (newStatus !== localStatus) setLocalStatus(newStatus);
    },
    onError: err => console.error("Failed to update process status:", err),
  });

  const { mutate: createTask, isLoading: creatingTask } = useCreateTask({
    onSuccess: (createdTask) => {
      if (optimisticRef.current) {
        setOptimisticAddedTasks(prev =>
          prev.filter(t => t._id !== optimisticRef.current)
        );
        optimisticRef.current = null;
      }

      setForm(defaultForm);
      setOpenDialog(false);

      queryClient.invalidateQueries(["process", process._id]);
    },
    onError: (err) => {
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

  const normalizedStatus = useMemo(() => String(localStatus ?? "").toLowerCase(), [localStatus]);

  if (deletedLocally) return null;

  const {
    data: billFromServer,
    isLoading: loadingBill,
    refetch: refetchBill,
  } = useGetBillByProcess(process?._id, { enabled: !!process?._id });

  useEffect(() => {
    if (!billFromServer) {
      setCurrentBill(null);
      return;
    }

    const billsArray = Array.isArray(billFromServer) ? billFromServer : [billFromServer];
    const approved = billsArray.find(b => String(b?.status ?? "").toLowerCase() === "approved");

    const pick =
      approved ||
      billsArray.slice().sort((a, b) => {
        const aTime = new Date(a?.createdAt ?? 0).getTime();
        const bTime = new Date(b?.createdAt ?? 0).getTime();
        return bTime - aTime;
      })[0] ||
      null;

    setCurrentBill(pick);
  }, [billFromServer]);

  const { mutate: createBill } = useCreateBill({
    onSuccess: (data) => {
      if (data) setCurrentBill(data);
    },
    onError: (err) => {
      console.error("createBill failed", err);
    },
  });

  useEffect(() => {
    const isProcessApproved = normalizedStatus === "approved" || (process?.status ?? "").toLowerCase() === "approved";
    if (isProcessApproved && process?._id) {
      if (typeof refetchBill === "function") refetchBill();
    }
  }, [normalizedStatus, process?._id, refetchBill, process?.status]);

  const showApprovedBill =
    currentBill &&
    String(currentBill?.status ?? "").toLowerCase() === "approved" &&
    (normalizedStatus === "approved" || (process?.status ?? "").toLowerCase() === "approved");

  const requestDeleteTask = taskId => {
    setPendingDeleteId(taskId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return setDeleteConfirmOpen(false);

    setOptimisticDeletedIds(prev => {
      const s = new Set(prev);
      s.add(pendingDeleteId);
      return s;
    });
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

    setDeleteProcessConfirmOpen(false);

    deleteProcess(
      { processId: process._id },
      {
        onSuccess: () => {

          setDeletedLocally(true);
          if (onDeleted) onDeleted(process._id);
        },
        onError: () => {
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
    createBill({ processId: process._id, notes: "Auto-generated on completion" });
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
                onTaskStatusChange={() => { }}
                onDeleteTask={requestDeleteTask}
              />
            ))
          )}
        </Stack>

        {/* If bill exists and both process & bill are approved, show a Bill preview */}
        {showApprovedBill && (
          <Box sx={{ mt: 2 }}><Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenBillPreview(true)}
            startIcon={<VisibilityIcon />}
          >
            View Approved Bill
          </Button></Box>
        )}


        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setDeleteProcessConfirmOpen(true)}
            disabled={deletingProcess || updatingStatusLoading || normalizedStatus !== "not started"}
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

      {/* Bill Detail Dialog: use the preview state & currentBill */}
      <BillDetailDialog
        open={openBillPreview}
        onClose={() => setOpenBillPreview(false)}
        bill={currentBill}
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
