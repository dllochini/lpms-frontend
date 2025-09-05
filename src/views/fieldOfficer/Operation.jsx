
import {
  Typography,
  Box,
  Paper,
  Button,
  Breadcrumbs,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { useState, useEffect } from "react";
import * as React from "react";
import DataGrid from "../../components/fieldOfficer/BasicDataGrid";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

import {
  getOperations,
  createOperation,
  updateOperationById,
  deleteOperationById,
} from "../../api/operation";

import OperationDialog from "../../components/fieldOfficer/OperationDialog"; // <-- import dialog

export default function Operation() {
  const [responseData, setResponseData] = useState([]);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // for edit mode

  // Fetch operations from backend
  const fetchData = async () => {
    const response = await getOperations();
    console.log("response :", response);
    setResponseData(response?.data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete handler
  const handleDelete = async (deletedOperationId) => {
    try {
      await deleteOperationById(deletedOperationId); // only call once (parent)
      console.log("Deleted operation ID:", deletedOperationId);
      setResponseData((prev) =>
        prev.filter((op) => op._id !== deletedOperationId)
      );
    } catch (error) {
      console.error("Delete failed in parent:", error);
      // optional user feedback
      if (error.response?.status === 404) {
        alert("Operation not found (already deleted).");
        // still remove it locally to keep UI consistent
        setResponseData((prev) =>
          prev.filter((op) => op._id !== deletedOperationId)
        );
      } else {
        alert("Failed to delete operation. See console for details.");
      }
    }
  };

  // Open dialog in Add mode
  const handleOpenAddDialog = () => {
    setSelectedRow(null);
    setOpenDialog(true);
  };

  // Open dialog in Edit mode
  const handleOpenEditDialog = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  // Submit form handler (Create or Update)
  const handleSubmitDialog = async (data) => {
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
            mb: 2,
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
      </Paper>

      {/* Add/Edit Dialog (imported) */}
      <OperationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitDialog}
        initialData={selectedRow}
      />
    </Box>
  );
}


