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
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { getUnits } from "../../api/unit";
import {
  createResource,
  getResources,
  updateResourceById,
} from "../../api/resources";

export default function ResourceDialog({
  open,
  onClose,
  defaultValues,
  categories,
  units,
}) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: defaultValues || {
      category: "",
      name: "",
      description: "",
      unitOfMeasure: "",
    },
  });

  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when defaultValues change
  useEffect(() => {
    if (open) {
      reset({
        resource: defaultValues.resource || "",
        category: defaultValues.category || "",
        unit: defaultValues.unit?._id || defaultValues.unit || "",
        description: defaultValues.description || "",
      });
    }
  }, [
    open,
    defaultValues.resource,
    defaultValues.category,
    defaultValues.unit?._id,
    defaultValues.description,
    reset,
  ]);

  const onSubmit = (data) => {
    setFormData(data);
    setOpenConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setOpenConfirm(false);
    try {
      let response;
      if (defaultValues?._id) {
        // Editing
        response = await updateResourceById(defaultValues._id, formData);
      } else {
        // Creating
        response = await createResource(formData);
      }

      console.log("Resource saved successfully:", response);
      setOpenSnackbar(true);
      reset();

      setTimeout(() => {
        navigate("/fieldOfficer/resources");
      }, 2000);
    } catch (error) {
      setSubmitError(error.response?.data?.error || "Something went wrong");
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
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Resource Name */}
            <Controller
              name="resource"
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

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
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
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
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
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleConfirmSubmit();
              onClose();
            }}
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
          Submission successful! Redirecting...
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
