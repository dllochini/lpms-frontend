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
  DataGrid
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import { Form } from "react-router-dom";

export default function OperationDialog({
  open,
  onClose, 
  onSave, 
  formData, 
  setFormData 
})
 {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
             { field: "_id", headerName: "LandID", flex: 2 },
             { field: "fieldOfficer", headerName: "Field Officer", flex: 2 },
             { field: "operation", headerName: "Operation", flex: 1.5 },
             { field: "startDate", headerName: "Start Date", flex: 1.5 },
             { field: "compeledDate", headerName: "Requested/Completed Date", flex: 2 },
             {
               field: "actions",
               type: "actions",
               headerName: "Action",
               flex: 2,
               getActions: (params) => [
         
                   <Button
                     variant="contained"
                     color="primary"
                     onClick={handleEditClick}
                     // startIcon={<AddIcon />}
                     sx={{ mb: 2,display: "flex", alignItems: "center" , justifyContent: "center" }}
                   
                   >
                     view Details
                   </Button>
         
         
                 
               ],
               sortable: false,
               filterable: false,
             },
           ];

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
      <DialogContent
        style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}
      >
        <div style={{ height: 400, width: "100%" }}>

            <DataGrid
        
              data={responseData}
              onDelete={handleDelete}
              onEdit={handleEditResource}
              autoHeight
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
