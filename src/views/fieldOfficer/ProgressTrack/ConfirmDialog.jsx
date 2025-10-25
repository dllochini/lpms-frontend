import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm",
  message,
  subMessage,
  confirmLabel = "Confirm",
  loading = false,
  confirmColor = "error",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 2, p: 0.5 } }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
        {subMessage && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {subMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          disabled={loading}
        >
          {loading ? `${confirmLabel.charAt(0).toUpperCase() + confirmLabel.slice(1)}ing...` : confirmLabel}

        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  subMessage: PropTypes.string,
  confirmLabel: PropTypes.string,
  loading: PropTypes.bool,
  confirmColor: PropTypes.string,
};

export default ConfirmDialog;
