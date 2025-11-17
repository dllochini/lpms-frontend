import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUpdateTask } from "../../../../hooks/task.hooks";
import { useCreateWorkDone, useDeleteWorkDone } from "../../../../hooks/workdone.hooks";
import ConfirmDialog from "../ConfirmDialog";
import AddTaskDialog from "./AddTaskDialog";
import ErrorDialog from "../ErrorDialog";

import WorkDoneGrid from "./WorkDoneGrid";
import ProgressDisplay from "./ProgressDisplay";
import NotesPreview from "./NotesPreview";

const TaskTable = ({ task = {}, onTaskStatusChange, onDeleteTask }) => {
  const taskKey = task._id ?? task.id ?? null;
  const [expandedTaskId, setExpand] = useState(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [localStatus, setLocalStatus] = useState(task?.status ?? "In Progress");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showApprovalExpanded, setShowApprovalExpanded] = useState(false);
  const [showIssueExpanded, setShowIssueExpanded] = useState(false);
  const [workDones, setWorkDones] = useState(Array.isArray(task?.workDones) ? task.workDones : []);
  const optimisticRef = useRef(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteRow, setPendingDeleteRow] = useState(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");

  useEffect(() => {
    if (task?.status && task.status !== localStatus) {
      setLocalStatus(task.status);
    }
    setWorkDones(Array.isArray(task?.workDones) ? task.workDones : []);
  }, [task?.status, task?.workDones]);

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

  const { mutate: createWorkDone, isLoading: creatingWorkDone } = useCreateWorkDone();
  const { mutate: deleteWorkDone, isLoading: deletingWorkDone } = useDeleteWorkDone();

  const [taskForm, setTaskForm] = useState({
    startDate: "",
    endDate: "",
    unit: "",
    workDone: 0,
    note: "",
  });

  const [deleteTaskConfirmOpen, setDeleteTaskConfirmOpen] = useState(false);
  const statusValue = String(localStatus ?? "Pending").toLowerCase();
  const isEditable = task?.done || statusValue !== "in progress" || updatingStatus || updatingStatusLoading;

  const handleRequestDeleteTask = () => {
    setDeleteTaskConfirmOpen(true);
  };
  const handleConfirmDeleteTask = () => {
    setDeleteTaskConfirmOpen(false);
    if (typeof onDeleteTask === "function") {
      onDeleteTask(taskKey);
    }
  };

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
                }
                : w
            );
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

  const approvalNote = task?.approvalNote ?? task?.approveNote ?? task?.approvalNotes ?? null;
  const issueNote = task?.issueNote ?? task?.issueNotes ?? task?.problemNote ?? null;

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

              {/* Approval Note preview */}
              <NotesPreview
                label="Approval note"
                text={approvalNote}
                expanded={showApprovalExpanded}
                onToggle={() => setShowApprovalExpanded((s) => !s)}
              />

              {/* Issue Note preview */}
              <NotesPreview
                label="Issue note"
                text={issueNote}
                expanded={showIssueExpanded}
                onToggle={() => setShowIssueExpanded((s) => !s)}
              />
            </Box>
          </Box>

          {/* Middle Section — ProgressDisplay component */}
          <ProgressDisplay
            workDones={workDones}
            estTotalWork={task?.estTotalWork}
            unitName={task?.resource?.unit?.name}
          />

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
            <WorkDoneGrid
              workDones={workDones}
              onDeleteRow={handleRequestDelete}
              loading={creatingWorkDone || deletingWorkDone}
              disableDelete={statusValue === "sent for approval"} // <-- disable delete
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
                <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-start" }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRequestDeleteTask}
                    disabled={isEditable}
                  >
                    Delete Operation
                  </Button>
                </Box>
                <Box sx={{ gap: 1, flex: 1, display: "flex", justifyContent: "flex-end  " }}>
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

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this progress entry? This action cannot be undone."
        confirmLabel="Delete"
        loading={deletingWorkDone}
        confirmColor="error"
      />

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
  onDeleteTask: PropTypes.func,
};

export default TaskTable;
