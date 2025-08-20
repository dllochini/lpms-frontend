
import {
  Typography,
  Box,
  Paper,
  Button,
  Breadcrumbs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputLabel,
  MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { useState, useEffect } from "react";
import * as React from "react";
import DataGrid from "../../components/fieldOfficer/BasicDataGrid";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

import {
  getOperations,
  createOperation,
  updateOperationById,
  deleteOperationById
} from "../../api/operation";

export default function Operation() {
  const [responseData, setResponseData] = useState([]);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // for edit

  const { control, handleSubmit, reset } = useForm();

  // Fetch operations from backend
  const fetchData = async () => {
    const response = await getOperations();
    setResponseData(response?.data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete handler
  const handleDelete = async (deletedOperationId) => {
    await deleteOperationById(deletedOperationId);
    setResponseData((prev) =>
      prev.filter((op) => op._id !== deletedOperationId)
    );
  };

  // Open dialog in Add mode
  const handleOpenAddDialog = () => {
    setSelectedRow(null);
    reset({
      operationName: "",
      relatedMachine: "",
      relatedImplement: "",
      note: ""
    });
    setOpenDialog(true);
  };

  // Open dialog in Edit mode
  const handleOpenEditDialog = (row) => {
    setSelectedRow(row);
    reset({
      operationName: row.operationName || "",
      relatedMachine: row.relatedMachine || "", // updated key
      relatedImplement: row.relatedImplement || "", // updated key
      note: row.note || ""
    });
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  // Submit form handler (Create or Update)
  const onSubmit = async (data) => {
    try {
      if (selectedRow) {
        // Update existing
        const res = await updateOperationById(selectedRow._id, data);
        setResponseData((prev) =>
          prev.map((item) =>
            item._id === selectedRow._id ? res.data : item
          )
        );
      } else {
        // Create new
        const res = await createOperation(data);
        setResponseData((prev) => [...prev, res.data]);
      }
      handleCloseDialog();
    } catch (err) {
      console.error("Failed to submit operation:", err);
    }
  };

  return (
    <Box>
      {/* Header and Breadcrumbs */}
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Operations
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Home
          </Link>
          <Typography color="text.primary">Operations</Typography>
        </Breadcrumbs>
      </Box>

      {/* Table & Add Button */}
      <Paper
        elevation={5}
        sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2
          }}
        >
          <Typography variant="h6"></Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddDialog}
            startIcon={<AddIcon />}
          >
            ADD NEW OPERATION
          </Button>
        </Box>

        <DataGrid
          data={responseData}
          onDelete={handleDelete}
          onEdit={handleOpenEditDialog}
        />

        {/* Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "20px",
              overflow: "hidden",
              px: 3,
              pt: 2
            }
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "1.25rem",
              py: 2
            }}
          >
            {selectedRow ? "Edit Operation" : "Add New Operation"}
          </DialogTitle>

          <DialogContent sx={{ px: 1, pb: 2 }}>
            {/* Name */}
            <InputLabel sx={{ mb: 0.5, fontWeight: 500 }}>
              Name of Operation :
            </InputLabel>
            <Controller
              name="operationName"
              control={control}
              defaultValue=""
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
              defaultValue=""
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
                mb: 2
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
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} fullWidth size="small" sx={{ mb: 2 }} />
              )}
            />

            {/* Note */}
            <InputLabel sx={{ mb: 0.5, fontWeight: 500 }}>Note :</InputLabel>
            <Controller
              name="note"
              control={control}
              defaultValue=""
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
                onClick={handleCloseDialog}
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 4
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
                  px: 4
                }}
              >
                {selectedRow ? "Update" : "Create"}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}
