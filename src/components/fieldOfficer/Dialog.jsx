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
  MenuItem
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import { Form } from "react-router-dom";

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
         <InputLabel sx={{ mb: 0.2 }}>Resource Name :</InputLabel>
          <TextField
              name="resourceName"
              value={formData?.resourceName || ""}
              onChange={handleChange}
              fullWidth
              size="small"
              sx={{ mb: 1 }}
            />
    
        
        {/* Category Dropdown */}
        <InputLabel sx={{mb:0.5}}>Category</InputLabel>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <Select
          name="category"
          value={formData?.category || ""}
          onChange={handleChange}
        >
          <MenuItem value="Machine">Machine</MenuItem>
          <MenuItem value="Vehicle">Vehicle</MenuItem>
          <MenuItem value="Manual">Manual</MenuItem>
        </Select>
      </FormControl>
        
        <InputLabel sx={{ mb: 0.5 }}>Unit Of Measure:</InputLabel>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <Select
            name="unitOfMeasure"
            value={formData?.unitOfMeasure || ""}
            onChange={handleChange}
          >
             <MenuItem value="Per acers">Per acers</MenuItem>
          <MenuItem value="Per hour">Per hour</MenuItem>
          <MenuItem value="Per square metres">Per square metres</MenuItem>
          </Select>
        </FormControl>
        {/* <TextField
          name="unitOfMeasure"
          value={formData?.unitOfMeasure || ""}
          onChange={handleChange}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        /> */}

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
