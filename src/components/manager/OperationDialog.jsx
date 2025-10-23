import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";
import { useUpdateTask } from "../../hooks/task.hooks";

export default function OperationDialog({
  open,
  onClose,
  control,
  initialData,
  initialTask,
}) {
  const [taskRows, setTaskRows] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
const [confirmAction, setConfirmAction] = useState(null); 
  console.log(initialTask, "dialog task");

  const { mutate: updateTask, isLoading: updatingTask } = useUpdateTask({
  onSuccess: (updatedTask) => {
    // success UI
    setOpenConfirm(false);
    setOpenSnackbar(true);
    // optionally close the dialog itself (parent) — call onClose to inform parent to refetch
    if (typeof onClose === "function") onClose();
  },
  onError: (err) => {
    setSubmitError(err?.message || "Failed to update task");
  },
});


  useEffect(() => {
    if (initialTask?.workDones?.length) {
      const rows = initialTask.workDones.map((wd, index) => ({
        id: wd._id ?? index,
        date: wd.startDate ? new Date(wd.startDate).toLocaleDateString() : "N/A",
        progress: wd.newWork ?? "N/A",
        note: wd.notes ?? "—",
      }));
      setTaskRows(rows);
    } else {
      setTaskRows([]);
    }
  }, [initialTask]);

  if (!initialData) return null;

  const columns = [
    { field: "id", headerName: "TaskID", flex: 2 },
    { field: "date", headerName: "Date", flex: 2 },
    // { field: "typeOfMachine", headerName: "Type of Machine", flex: 1.5 },
    // { field: "unitOfMeasure", headerName: "Unit of Measure", flex: 1.5 },
    { field: "progress", headerName: "Progress", flex: 2 },
    { field: "note", headerName: "Note", flex: 2 },
  ];

  const handleConfirmSubmit = async () => {
  // sanity
  if (!initialTask?._id) {
    setSubmitError("No task selected");
    return;
  }
  if (!confirmAction) {
    setSubmitError("No action selected");
    return;
  }

  setIsSubmitting(true);
  setSubmitError("");

  const newStatus = confirmAction === "approve" ? "Approved" : "Rejected";

  // include endDate when approving (optional)
  const updatedData = {
    status: newStatus,
    ...(confirmAction === "approve" ? { endDate: new Date().toISOString() } : {}),
  };

  // If your hook supports callbacks in mutate call:
  updateTask(
    { taskId: initialTask._id, updatedData },
    {
      onSuccess: (updatedTask) => {
        setIsSubmitting(false);
        setOpenConfirm(false);
        setOpenSnackbar(true);
        if (typeof onClose === "function") onClose();
      },
      onError: (err) => {
        setIsSubmitting(false);
        setSubmitError(err?.message || "Failed to update task");
      },
    }
  );

  // If your hook configuration already handled onSuccess/onError,
  // you could call: updateTask({ taskId: initialTask._id, updatedData });
};


  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
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
          <div style={{ height: 200, width: "100%" }}>
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
              {initialTask?.createdBy?.fullName ?? "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {initialTask?.status ?? "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Machine:</strong> {initialTask?.resource?.name ?? "N/A"}{" "}
              {initialTask?.resource?.unit?.symbol ?? "N/A"}
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

        <DialogActions>
  <Button
    onClick={() => {
      setConfirmAction("reject");
      setOpenConfirm(true);
    }}
    variant="contained"
    color="secondary"
    disabled={updatingTask}
  >
    REJECT
  </Button>

  <Button
    onClick={() => {
      setConfirmAction("approve");
      setOpenConfirm(true);
    }}
    variant="contained"
    color="success"
    disabled={updatingTask}
  >
    ACCEPT
  </Button>
</DialogActions>

      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
  <DialogTitle>
    {confirmAction === "approve" ? "Confirm Approval" : "Confirm Rejection"}
  </DialogTitle>
  <DialogContent>
    {confirmAction === "approve"
      ? "Are you sure you want to APPROVE this operation? This will set task status to 'Approved'."
      : "Are you sure you want to REJECT this operation? This will set task status to 'Rejected'."}
    {submitError && <div style={{ color: "red", marginTop: 8 }}>{submitError}</div>}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenConfirm(false)} disabled={isSubmitting}>
      Cancel
    </Button>
    <Button onClick={handleConfirmSubmit} color="primary" variant="contained" disabled={isSubmitting || updatingTask}>
      {isSubmitting || updatingTask ? "Processing..." : (confirmAction === "approve" ? "Yes, Approve" : "Yes, Reject")}
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
          Operation approved successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!submitError}
        autoHideDuration={4000}
        onClose={() => setSubmitError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setSubmitError("")}>
          {submitError}
        </Alert>
      </Snackbar>
    </>
  );
}
