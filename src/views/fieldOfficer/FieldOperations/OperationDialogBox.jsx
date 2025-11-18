import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputLabel,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

export default function OperationDialog({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: initialData || {
      name: "",
      note: "",
    },
  });

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  React.useEffect(() => {
    reset(
      initialData || {
        name: "",
        note: "",
      }
    );
  }, [initialData, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      setSnackbar({
        open: true,
        message: initialData
          ? "Operation updated successfully!"
          : "Operation created successfully!",
        severity: "success",
      });
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            px: 3,
            pt: 2,
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
          {initialData ? "Edit Operation" : "Add New Operation"}
        </DialogTitle>

        <DialogContent sx={{ px: 1, pb: 2 }}>
          {/* Name */}
          <InputLabel sx={{ mb: 0.5, fontWeight: 500 }}>
            Name of Operation :
          </InputLabel>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Note */}
          <InputLabel sx={{ mb: 0.5, fontWeight: 500 }}>Note :</InputLabel>
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                multiline
                minRows={3}
                sx={{ mb: 2 }}
              />
            )}
          />
        </DialogContent>

        {/* Action Buttons */}
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              onClick={onClose}
              variant="contained"
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: "bold",
                px: 4,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(handleFormSubmit)}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: "bold",
                px: 4,
              }}
            >
              {initialData ? "Update" : "Create"}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
