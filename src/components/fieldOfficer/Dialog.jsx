// src/components/fieldOfficer/ResourceDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

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
        <TextField
          name="id"
          label="Resource ID"
          value={formData?.id || ""}
          onChange={handleChange}
        />
        <TextField
          name="category"
          label="Category"
          value={formData?.category || "" }
          onChange={handleChange}
        />
        <TextField
          name="unitOfMeasure"
          label="Unit of Measure"
          value={formData?.unitOfMeasure || ""}
          onChange={handleChange}
        />
        <TextField
          name="note"
          label="Note"
          value={formData?.note || ""}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
