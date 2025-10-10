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

export default function OperationDialog({
  open,
  onClose,
  onSave,
  data,
  initialData,
}) {
  const [taskRows, setTaskRows] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (initialData?.tasks) {
      const rows = initialData.tasks.map((task, index) => ({
        id: task.taskId ?? index,
        date: task.date,
        typeOfMachine: task.typeOfMachine,
        unitOfMeasure: task.unit,
        todayProgress: task.progress,
        note: task.notes,
      }));
      setTaskRows(rows);
    } else {
      setTaskRows([]);
    }
  }, [initialData]);

  if (!initialData) return null;

  const columns = [
    { field: "id", headerName: "TaskID", flex: 2 },
    { field: "date", headerName: "Date", flex: 2 },
    { field: "typeOfMachine", headerName: "Type of Machine", flex: 1.5 },
    { field: "unitOfMeasure", headerName: "Unit of Measure", flex: 1.5 },
    { field: "todayProgress", headerName: "Today Progress", flex: 2 },
    { field: "note", headerName: "Note", flex: 2, sortable: false, filterable: false },
  ];

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      if (typeof onSave === "function") {
        await onSave(initialData); // pass back initialData
      }
      setOpenConfirm(false);
      setOpenSnackbar(true);
    } catch (err) {
      setSubmitError(err?.message || String(err) || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
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
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "left", fontSize: "1.25rem", py: 2 }}>
          Operation Approval
          <hr style={{ border: "none", height: "1px", backgroundColor: "#000", margin: "8px 0" }} />
        </DialogTitle>

        <DialogContent style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
          <div style={{ height: 200, width: "100%" }}>
            <Typography variant="body1"><strong>Land ID:</strong> {initialData.landId}</Typography>
            <Typography variant="body1"><strong>Field Officer:</strong> {initialData.fieldOfficer}</Typography>
            <Typography variant="body1"><strong>Operation:</strong> {initialData.operation}</Typography>
            <Typography variant="body1"><strong>Start Date:</strong> {initialData.startDate}</Typography>
            <Typography variant="body1"><strong>Complete Date:</strong> {initialData.completedDate}</Typography>
            <hr style={{ border: "none", height: "1px", backgroundColor: "#000", margin: "8px 0" }} />
          </div>

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={taskRows}
              columns={columns}
              rowHeight={100}
              pageSizeOptions={[10, 20, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              density="compact"
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
              }
              checkboxSelection={false}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="contained" color="secondary">
            REJECT
          </Button>
          <Button onClick={() => setOpenConfirm(true)} variant="contained" color="success">
            ACCEPT
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          {"Are you sure you want to approve this operation?"}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmSubmit} color="primary" variant="contained" disabled={isSubmitting}>
            Yes, Submit
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
