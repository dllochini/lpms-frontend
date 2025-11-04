import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { createResource, updateResourceById } from "../../../api/resources";

export default function ResourceDialog({
  open,
  onClose,
  defaultValues,
  categories = [],
  units = [],
  onSuccess, // callback to refresh parent
}) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      category: "",
      unit: "",
      unitPrice: "", // new
      notes: "",
    },
  });

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens or defaultValues changes
  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name || "",
        category: defaultValues?.category || "",
        unit:
          (defaultValues?.unit && defaultValues.unit._id) ||
          defaultValues?.unit ||
          "",
        unitPrice:
          typeof defaultValues?.unitPrice === "number"
            ? String(defaultValues.unitPrice)
            : defaultValues?.unitPrice ?? "",
        notes: defaultValues?.notes || "",
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data) => {
    setFormData(data);
    setOpenConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setOpenConfirm(false);
    setSubmitError("");
    try {
      // Ensure unitPrice is number
      const payload = {
        ...formData,
        unitPrice:
          formData.unitPrice === "" || formData.unitPrice === null
            ? 0
            : Number(formData.unitPrice),
      };

      let response;
      if (defaultValues?._id) {
        // Editing
        response = await updateResourceById(defaultValues._id, payload);
      } else {
        // Creating
        response = await createResource(payload);
      }

      // success UI
      setOpenSnackbar(true);
      reset();

      // notify parent to refresh data
      if (onSuccess) {
        try {
          await onSuccess();
        } catch (e) {
          console.warn("onSuccess callback failed:", e);
        }
      }

      // close dialog after success
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
      setSubmitError(
        (error?.response && error.response?.data?.error) || "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            overflow: "auto",
            px: 3,
            py: 2,
            width: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          {defaultValues?._id ? "Edit Resource" : "Add New Resource"}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Resource Name */}
            <Controller
              name="name"
              control={control}
              rules={{ required: "Resource name is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Resource Name"
                  fullWidth
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            {/* Category */}
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select {...field} label="Category">
                    {categories.map((c, index) => (
                      <MenuItem key={index} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            {/* Unit of Measure */}
            <Controller
              name="unit"
              control={control}
              rules={{ required: "Unit is required" }}
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  <InputLabel>Unit</InputLabel>
                  <Select {...field} label="Unit">
                    {units.map((u) => (
                      <MenuItem key={u._id} value={u._id}>
                        {u.name} - {u.symbol}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            {/* Unit Price */}
            <Controller
              name="unitPrice"
              control={control}
              rules={{
                validate: (val) => {
                  if (val === "" || val === null) return true; // allow empty (interpreted as 0)
                  const n = Number(val);
                  if (Number.isNaN(n)) return "Unit price must be a number";
                  if (n < 0) return "Unit price cannot be negative";
                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Unit Price"
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ step: "0.01", min: "0" }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || "Enter price per unit (optional)"}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
                  }}
                />
              )}
            />

            {/* notes */}
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Notes"
                  fullWidth
                  size="small"
                  multiline
                  rows={4}
                />
              )}
            />
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", mt: 1 }}>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          {defaultValues?._id
            ? "Are you sure you want to update this resource?"
            : "Are you sure you want to create this resource?"}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            Yes, Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          {defaultValues?._id ? "Resource updated successfully!" : "Resource created successfully!"}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!submitError}
        autoHideDuration={4000}
        onClose={() => setSubmitError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setSubmitError("")}>
          {submitError}
        </Alert>
      </Snackbar>
    </>
  );
}
