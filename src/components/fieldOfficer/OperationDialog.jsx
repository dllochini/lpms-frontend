import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputLabel,
  MenuItem,
  Button,
  Box,
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
      operationName: "",
      relatedMachine: "",
      relatedImplement: "",
      note: "",
    },
  });

  // Reset form when data changes (important for edit mode)
  React.useEffect(() => {
    reset(initialData || {
      operationName: "",
      relatedMachine: "",
      relatedImplement: "",
      note: "",
    });
  }, [initialData, reset]);

  return (
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
          name="operationName"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth size="small" sx={{ mb: 2 }} />
          )}
        />

        {/* Related Machines */}
        <InputLabel sx={{ mb: 0.5, fontWeight: 500 }}>
          Related Machines :
        </InputLabel>
        <Controller
          name="relatedMachine"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth size="small" select sx={{ mb: 1 }}>
              <MenuItem value="tractor">Tractor</MenuItem>
              <MenuItem value="harvester">Harvester</MenuItem>
              <MenuItem value="sprayer">Sprayer</MenuItem>
            </TextField>
          )}
        />

        {/* Add New Machine Button (optional) */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            fontWeight: "bold",
            py: 1,
            mb: 2,
          }}
        >
          Add New Machine
        </Button>

        {/* Related Implements */}
        <InputLabel sx={{ mb: 0.5, fontWeight: 500 }}>
          Related Implements :
        </InputLabel>
        <Controller
          name="relatedImplement"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth size="small" sx={{ mb: 2 }} />
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
            onClick={handleSubmit(onSubmit)}
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
  );
}
