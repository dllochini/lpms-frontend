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
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";

export default function ResourceDialog({
  open,
  onClose, 
  onSave, 
  formData, 
  setFormData 
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
          textAlign: "center",
          fontSize: "1.25rem",
          py: 2,
        }}
      >
        {formData?.id ? "Edit Resource": "Add New Resource"}
        </DialogTitle>
      <DialogContent
        style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}
      >
         <InputLabel sx={{ mb: 0.5 }}>Resource ID :</InputLabel>
          <TextField
              name="id"
              value={formData?.id || ""}
              onChange={handleChange}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />
    
        
        <InputLabel sx={{ mb: 0.5 }}>Category :</InputLabel>
        <TextField
          name="category"
          value={formData?.category || "" }
          onChange={handleChange}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        
        <InputLabel sx={{ mb: 0.5 }}>Unit Of Measure:</InputLabel>
        <TextField
          name="unitOfMeasure"
          value={formData?.unitOfMeasure || ""}
          onChange={handleChange}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />

        <InputLabel sx={{ mb: 0.5 }}>Note:</InputLabel>
        <TextField
          name="note"
          value={formData?.note || ""}
          onChange={handleChange}
          fullWidth
          size="small"
          multiline
          rows={4}
          placeholder="Enter any additional notes or details"
          sx={{ mb: 2 }}
        />
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
