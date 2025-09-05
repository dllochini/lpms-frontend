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
  getOperationById,
  createOperation,
  updateOperationById,
  deleteOperationById,
} from "../../api/operation";

import { getImplementsByOperation } from "../../api/implement";

import OperationDialog from "../../components/fieldOfficer/OperationDialog";

export default function Operation() {
  const [responseData, setResponseData] = useState([]);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Fetch operations (already includes implements)
  const fetchData = async () => {
    try {
      const response = await getImplementsByOperation();
      setResponseData(response?.data ?? []);
    } catch (err) {
      console.error("Failed to fetch operations:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete handler
  const handleDelete = async (deletedOperationId) => {
    try {
      await deleteOperationById(deletedOperationId);
      setResponseData((prev) =>
        prev.filter((op) => op._id !== deletedOperationId)
      );
    } catch (error) {
      console.error("Delete failed:", error);
      if (error.response?.status === 404) {
        alert("Operation not found (already deleted).");
        setResponseData((prev) =>
          prev.filter((op) => op._id !== deletedOperationId)
        );
      } else {
        alert("Failed to delete operation. See console for details.");
      }
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedRow(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = async (row) => {
    try {
      const res = await getOperationById(row._id);
      setSelectedRow(res.data);
      setOpenDialog(true);
    } catch (err) {
      console.error("Failed to fetch operation:", err);
      alert("Failed to load operation data.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const handleSubmitDialog = async (data) => {
    try {
      if (selectedRow) {
        const res = await updateOperationById(selectedRow._id, data);
        setResponseData((prev) =>
          prev.map((item) =>
            item._id === selectedRow._id ? res.data : item
          )
        );
      } else {
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

      <OperationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitDialog}
        initialData={selectedRow}
      />
    </Box>
  );
}
