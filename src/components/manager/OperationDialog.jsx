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
  Box
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


  return (
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
        <Button onClick={onClose}variant= "contained" color= "red">REJECT</Button>
        <Button onClick={onSave} variant="contained" color="grren">
          ACCEPT
        </Button>
      </DialogActions>
    </Dialog>
  );
}
