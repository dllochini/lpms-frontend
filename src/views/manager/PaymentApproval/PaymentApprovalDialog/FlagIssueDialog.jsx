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

const FlagIssueDialog = ({
  open,
  onClose,
  onSubmit,
  flagText,
  setFlagText,
  loading,
  error,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Flag an Issue</DialogTitle>
    <DialogContent sx={{ minWidth: 420 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Describe the issue so it can be reviewed:
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={4}
        value={flagText}
        onChange={(e) => setFlagText(e.target.value)}
        placeholder="Explain the issue (wrong details, missing info, etc.)"
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
        color="warning"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? "Processing..." : "Flag Issue"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default FlagIssueDialog;