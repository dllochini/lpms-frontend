// AddTaskDialog.jsx
import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const AddTaskDialog = ({
  open,
  onClose,
  onSubmit,
  taskForm,
  onFormChange,
  selectedTask,
  creatingWorkDone,
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
          fontSize: "1.3rem",
          color: "primary.main",
        }}
      >
        Add New Progress
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Task Information */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Operation:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {selectedTask?.operation?.name || "-"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flex: "1 1 45%",
                  minWidth: 140,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Machine:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedTask?.resource?.name || "-"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flex: "1 1 45%",
                  minWidth: 120,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Unit:
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedTask?.resource?.unit?.name || "-"} (
                  {selectedTask?.resource?.unit?.symbol || "-"})
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Date Fields */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              value={taskForm.startDate}
              onChange={onFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              value={taskForm.endDate}
              onChange={onFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {/* Work Done */}
          <TextField
            label={`Work Done (${selectedTask?.resource?.unit?.name ?? ""})`}
            type="number"
            name="workDone"
            value={taskForm.workDone}
            onChange={onFormChange}
            fullWidth
          />

          {/* Note */}
          <TextField
            label="Note"
            name="note"
            value={taskForm.note}
            onChange={onFormChange}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
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
          onClick={onSubmit}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          {creatingWorkDone ? "Adding..." : "Add Progress"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddTaskDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  taskForm: PropTypes.object.isRequired,
  onFormChange: PropTypes.func.isRequired,
  selectedTask: PropTypes.object,
  creatingWorkDone: PropTypes.bool,
};

export default AddTaskDialog;
