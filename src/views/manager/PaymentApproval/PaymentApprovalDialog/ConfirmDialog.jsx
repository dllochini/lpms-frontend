import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
} from "@mui/material";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  feedback,
  setFeedback,
  loading,
  error,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent sx={{ minWidth: 420 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Are you sure you want to <strong>APPROVE</strong> this bill?
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
        (Optional) Add feedback:
      </Typography>

      <TextField
        fullWidth
        multiline
        minRows={3}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Add feedback..."
      />

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={loading}>Cancel</Button>
      <Button
        variant="contained"
        color="success"
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? "Processing..." : "Yes, Approve"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
