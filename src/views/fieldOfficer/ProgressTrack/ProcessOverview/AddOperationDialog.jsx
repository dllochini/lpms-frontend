// src/components/AddOperationDialog.jsx
import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const AddOperationDialog = ({
  open,
  onClose,
  onSubmit,
  form,
  onChange,
  operations,
  resources,
  loadingOperations,
  loadingResources,
  creatingTask,
  anySentForApproval,
}) => {

      
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, p: 1.5 } }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          textAlign: "center",
          fontSize: "1.2rem",
          color: "primary.main",
        }}
      >
        Add New Operation
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Box
          component="form"
          id="add-operation-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl fullWidth>
            <InputLabel id="operation-label">Operation</InputLabel>
            <Select
              name="operation"
              labelId="operation-label"
              value={form.operation || ""}
              onChange={onChange}
              label="Operation"
            >
              {loadingOperations ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : operations.length === 0 ? (
                <MenuItem disabled>No operations found</MenuItem>
              ) : (
                operations.map((op) => (
                  <MenuItem key={op._id} value={op._id}>
                    {op.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="machine-label">Machine</InputLabel>
            <Select
              name="machine"
              labelId="machine-label"
              value={form.machine || ""}
              onChange={onChange}
              label="Machine"
            >
              {loadingResources ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : resources.length === 0 ? (
                <MenuItem disabled>No machines found</MenuItem>
              ) : (
                resources.map((res) => (
                  <MenuItem key={res._id} value={res._id}>
                    {res.name} ({res.unit?.symbol || "-"})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              value={form.startDate || ""}
              onChange={onChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Expected End Date"
              type="date"
              name="expectedEndDate"
              value={form.expectedEndDate || ""}
              onChange={onChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <TextField
            label="Estimated Work"
            name="estimatedWork"
            type="number"
            value={form.estimatedWork ?? ""}
            onChange={onChange}
            fullWidth
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Note"
            name="note"
            value={form.note || ""}
            onChange={onChange}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 3,
          pb: 2,
        }}
      >
        <Button
          onClick={onClose}
          color="inherit"
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          form="add-operation-form"
          type="submit"
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          disabled={anySentForApproval || creatingTask}
        >
          {creatingTask ? "Starting..." : "Start Operation"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddOperationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  operations: PropTypes.array.isRequired,
  resources: PropTypes.array.isRequired,
  loadingOperations: PropTypes.bool,
  loadingResources: PropTypes.bool,
  creatingTask: PropTypes.bool,
  anySentForApproval: PropTypes.bool,
};

export default AddOperationDialog;
