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
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import { Form } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';


export default function OperationDialog({
  open,
  onClose, 
  onSave, 
  formData, 
  setFormData,
  data
})
 {
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
      {field: "note",type: "actions",headerName: "Note",flex: 2,sortable: false,filterable: false,},
        // getActions: (params) => [
  
        //     <Button
        //       variant="contained"
        //       color="primary"
        //       onClick={handleEditClick}
        //       // startIcon={<AddIcon />}
        //       sx={{ mb: 2,display: "flex", alignItems: "center" , justifyContent: "center" }}
            
        //     >
        //       view Details
        //     </Button>
  
  
          
        // ],
         ];
  
  const rows = Array.isArray(data)
    ? data.map((row) => ({
        id: row._id,
        ...row,
        unit: row.unitID?.name || row.unitID || 'N/A', // fallback if name not populated
      }))
    : [];


  return (
    <Dialog open={open} onClose={onClose}
      fullWidth
      maxWidth="sm"
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
        <div style={{ height: 400, width: "100%" }}>

            <DataGrid
        
              rows={rows}
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
        <Button onClick={onClose}variant= "contained" color= "primary">Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
