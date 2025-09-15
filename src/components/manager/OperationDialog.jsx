// src/components/fieldOfficer/ResourceDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Input,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import { Form } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from "react";


export default function OperationDialog({
  open,
  onClose, 
  onSave, 
  formData, 
  setFormData,
  data,
  initialData
})
 {

  const [taskRows, setTaskRows] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (initialData?.tasks) {
      const rows = initialData.tasks.map((task, index) => ({
        id: task.taskId || index,
        date: task.date,
        typeOfMachine: task.typeOfMachine,
        unitOfMeasure: task.unit,
        todayProgress: task.progress,
        note: task.notes,
      }));
      setTaskRows(rows);
    } else {
      setTaskRows([]); // No tasks
    }
  }, [initialData]);


  if (!initialData) return null; // nothing selected yet

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (id) => {
    const resource = data.find((r) => r._id === id);
    if (onEdit) onEdit(resource);
  };

  const columns = [
      { field: "_id", headerName: "TaskID", flex: 2 },
      { field: "date", headerName: "Date", flex: 2 },
      { field: "typeOfMachine", headerName: "Type of Machine", flex: 1.5 },
      { field: "unitOfMeasure", headerName: "Unit of Measure", flex: 1.5 },
      { field: "todayProgress", headerName: "Today Progress", flex: 2 },
      {field: "note",headerName: "Note",flex: 2,sortable: false,filterable: false,},
         ];
  
  const rows = Array.isArray(initialData?.tasks)
    ? initialData.tasks.map((row) => ({
        id: row._id,
        ...row,
        unit: row.TaskID?.name || row.TaskID || 'N/A', // fallback if name not populated
      }))
    : [];

    const isEditing = Boolean(formData?.id || initialData?._id);


    const handleConfirmSubmit = async () => {
      setIsSubmitting(true);
      setSubmitError("");
      try {
      if (typeof onSave === "function") {
      // allow onSave to be async (return a promise)
      await onSave(formData);
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
    <Dialog open={open} onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
            sx: {
              borderRadius: "20px", // rounded corners
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
         
        {formData?.id ? "Edit Resource": "Operation Approval"}
        <hr style={{ 
          border: "none", 
          height: "1px", 
          backgroundColor: "#000", 
          margin: "8px 0" 
        }} />

        
        </DialogTitle>
      <DialogContent style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
        <div style={{ height: 200, width: "100%" }}>
          <Typography variant="body1">
          <strong>Land ID:</strong> {initialData.landId}
          </Typography>
          <Typography variant="body1">
            <strong>Field Officer:</strong> {initialData.fieldOfficer}
          </Typography>
          <Typography variant="body1">
            <strong>Operation:</strong> {initialData.operation}
          </Typography>
          <Typography variant="body1">
            <strong>Start Date:</strong> {initialData.startDate}
          </Typography>
          <Typography variant="body1">
            <strong>Complete Date:</strong> {initialData.completedDate}
          </Typography>
          <hr style={{ 
            border: "none", 
            height: "1px", 
            backgroundColor: "#000", 
            margin: "8px 0" 
          }} />
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
        <Button onClick={onClose}variant= "contained" color= "secondary">REJECT</Button>
        <Button onClick={onSave} variant="contained" color="success">
          ACCEPT
        </Button>
      </DialogActions>
    </Dialog>

        {/* Confirm Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <>
          {defaultValues?._id
            ? "Are you sure you want to update this resource?"
            : "Are you sure you want to create this resource?"}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmSubmit}
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
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
          {defaultValues?._id ? "Resource updated successfully!" : "Resource created successfully!"}
        </Alert>
      </Snackbar>

      /* Error Snackbar */
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
