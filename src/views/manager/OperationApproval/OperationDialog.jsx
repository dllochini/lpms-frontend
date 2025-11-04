import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { DataGrid } from "@mui/x-data-grid";
import { useUpdateTask } from "../../../hooks/task.hooks";

export default function OperationDialog({
  open,
  onClose,
  control, // kept for compatibility, not used here
  initialData,
  initialTask,
}) {
  // table rows for task.workDones
  const [taskRows, setTaskRows] = useState([]);

  // confirm approve dialog
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // approval feedback
  const [approvalFeedback, setApprovalFeedback] = useState("");

  // flag/issue dialog
  const [openFlagDialog, setOpenFlagDialog] = useState(false);
  const [flagText, setFlagText] = useState("");

  // snackbars
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // which action is being confirmed (only 'approve' used here)
  const [confirmAction, setConfirmAction] = useState(null);

  // mutation hook
  const { mutate: updateTask, isLoading: updatingTask } = useUpdateTask();

  // populate workDones table when initialTask changes
  useEffect(() => {
    const wds = initialTask?.workDones ?? [];
    const rows = Array.isArray(wds)
      ? wds.map((wd, index) => ({
          id: wd._id ?? `${initialTask?._id ?? "t"}-${index}`,
          date: wd.startDate ? new Date(wd.startDate).toLocaleDateString() : "N/A",
          progress: wd.newWork ?? "N/A",
          note: wd.notes ?? wd.note ?? "—",
        }))
      : [];
    setTaskRows(rows);
  }, [initialTask]);

  // if parent didn't provide initialData (grid row), don't render dialog
  if (!initialData) return null;

  const columns = [
    { field: "id", headerName: "TaskID", flex: 2 },
    { field: "date", headerName: "Date", flex: 2, headerAlign: "center", align: "center" },
    { field: "progress", headerName: "Progress", flex: 2, headerAlign: "center", align: "center" },
    { field: "note", headerName: "Note", flex: 2 },
  ];

  // centralized close handler that resets transient states
  const handleCloseAll = () => {
    setOpenConfirm(false);
    setOpenFlagDialog(false);
    setIsSubmitting(false);
    setApprovalFeedback("");
    setFlagText("");
    setSubmitError("");
    setConfirmAction(null);
    if (typeof onClose === "function") onClose();
  };

  // Confirm (Approve) submit handler
  const handleConfirmSubmit = async () => {
    if (!initialTask?._id) {
      setSubmitError("No task selected");
      return;
    }
    if (confirmAction !== "approve") {
      setSubmitError("No action selected");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const updatedData = {
      status: "Approved",
      endDate: new Date().toISOString(),
      approvalNote: approvalFeedback?.trim() || undefined,
    };

    updateTask(
      { taskId: initialTask._id, updatedData },
      {
        onSuccess: (updatedTask) => {
          setIsSubmitting(false);
          setOpenConfirm(false);
          setApprovalFeedback("");
          setOpenSnackbar(true);
          if (typeof onClose === "function") onClose(); // let parent refresh
        },
        onError: (err) => {
          setIsSubmitting(false);
          const message = err?.message || "Failed to update task";
          setSubmitError(message);
        },
      }
    );
  };

  // Flag Issue handler (reports issue instead of reject)
  const handleFlagIssue = async () => {
    if (!initialTask?._id) {
      setSubmitError("No task selected");
      return;
    }
    if (!flagText || flagText.trim().length < 5) {
      setSubmitError("Please provide a short description of the issue (at least 5 characters).");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const updatedData = {
      status: "Issue", // adjust if your backend expects a different status
      issueNote: flagText.trim(),
    };

    updateTask(
      { taskId: initialTask._id, updatedData },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          setOpenFlagDialog(false);
          setFlagText("");
          setOpenSnackbar(true);
          if (typeof onClose === "function") onClose();
        },
        onError: (err) => {
          setIsSubmitting(false);
          setSubmitError(err?.message || "Failed to flag issue");
        },
      }
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseAll}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "left",
            fontSize: "1.25rem",
            py: 2,
          }}
        >
          Operation Approval
          <hr
            style={{
              border: "none",
              height: "1px",
              backgroundColor: "#000",
              margin: "8px 0",
            }}
          />
        </DialogTitle>

        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <div style={{ width: "100%" }}>
            <Typography variant="body1">
              <strong>Land:</strong>{" "}
              {initialTask?.process?.land?.address ?? "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Operation:</strong>{" "}
              {initialTask?.operation?.name ?? "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Field Officer:</strong>{" "}
              {initialTask?.assignedTo?.fullName ?? "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {initialTask?.status ?? "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Machine:</strong> {initialTask?.resource?.name ?? "N/A"}{" "}
              {initialTask?.resource?.unit?.symbol ?? ""}
            </Typography>

            <hr
              style={{
                border: "none",
                height: "1px",
                backgroundColor: "#000",
                margin: "8px 0",
              }}
            />
          </div>

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={taskRows}
              columns={columns}
              rowHeight={100}
              pageSizeOptions={[10, 20, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              density="compact"
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
              }
              checkboxSelection={false}
            />
          </div>
        </DialogContent>

        {/* Actions: Flag Issue + Accept */}
        <DialogActions sx={{ gap: 1, px: 3, py: 2 }}>
          <Button
            onClick={() => {
              setSubmitError("");
              setOpenFlagDialog(true);
            }}
            variant="outlined"
            color="warning"
            startIcon={<ReportProblemIcon />}
            disabled={updatingTask}
          >
            Flag Issue
          </Button>

          <Button
            onClick={() => {
              setConfirmAction("approve");
              setOpenConfirm(true);
              setSubmitError("");
            }}
            variant="contained"
            color="success"
            disabled={updatingTask || initialTask?.status === "Approved"}
          >
            ACCEPT
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog for Approve (includes optional feedback) */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Approval</DialogTitle>

        <DialogContent sx={{ minWidth: 420 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Are you sure you want to <strong>APPROVE</strong> this operation?
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
            (Optional) Add feedback that will be saved with the approval:
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={3}
            value={approvalFeedback}
            onChange={(e) => setApprovalFeedback(e.target.value)}
            placeholder="Add an optional note for the field officer..."
            variant="outlined"
          />

          {submitError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {submitError}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            onClick={handleConfirmSubmit}
            color="primary"
            variant="contained"
            disabled={isSubmitting || updatingTask}
          >
            {isSubmitting || updatingTask ? "Processing..." : "Yes, Approve"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Flag Issue Dialog */}
      <Dialog open={openFlagDialog} onClose={() => setOpenFlagDialog(false)}>
        <DialogTitle>Flag an Issue</DialogTitle>

        <DialogContent sx={{ minWidth: 420 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Describe the issue so the field officer / manager can review it.
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={4}
            value={flagText}
            onChange={(e) => setFlagText(e.target.value)}
            placeholder="Explain the issue (missing details, wrong machine, safety issue, etc.)"
            variant="outlined"
          />

          {submitError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {submitError}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenFlagDialog(false)} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            onClick={handleFlagIssue}
            variant="contained"
            color="warning"
            disabled={isSubmitting || updatingTask}
          >
            {isSubmitting || updatingTask ? "Processing..." : "Flag Issue"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          {confirmAction === "approve" ? "Operation approved successfully!" : "Saved."}
        </Alert>
      </Snackbar>

      {/* Error Snackbar with quick Report action */}
      <Snackbar
        open={!!submitError}
        autoHideDuration={6000}
        onClose={() => setSubmitError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setSubmitError("");
                setOpenFlagDialog(true);
              }}
            >
              Report
            </Button>
          }
          onClose={() => setSubmitError("")}
        >
          {submitError}
        </Alert>
      </Snackbar>
    </>
  );
}
