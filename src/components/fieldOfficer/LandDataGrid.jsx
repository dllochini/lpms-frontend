// src/components/admin/LandsDataGrid.js
import * as React from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { deleteLandById } from "../../api/land"; // <-- new delete API
import { useState } from "react";

const LandsDataGrid = ({ data, onDelete }) => {
  const navigate = useNavigate();

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState("");

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleDeleteClick = (id) => {
    const land = data.find((l) => l._id === id);
    setSelectedFarmer(land ? land.farmerName : "");
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        await deleteLandById(selectedId);
        if (onDelete) onDelete(selectedId);

        setSnackbarMessage(
          `Land record of farmer "${selectedFarmer}" deleted successfully`
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Delete failed:", error);
        setSnackbarMessage("Failed to delete land");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleEditClick = (id) => {
    navigate(`/lands/edit/${id}`);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const columns = [
    { field: "landId", headerName: "Land ID", flex: 1.5 },
    { field: "farmer", headerName: "Farmer Name", flex: 2.5 },
    { field: "location", headerName: "Address", flex: 3 },
    { field: "size", headerName: "Area (Acres)", flex: 1.5 },
    { field: "contact", headerName: "Contact Details", flex: 2.5 },
    { field: "note", headerName: "Note", flex: 3 },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      flex: 1.5,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEditClick(params.id)}
          key="edit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.id)}
          key="delete"
        />,
      ],
    },
  ];

  const rows = Array.isArray(data)
    ? data.map((row) => ({
        id: row._id,
        ...row,
        farmer:
        typeof row.farmer === "object" && row.farmer !== null
              ? row.farmer.fullName
              : row.farmer,
        contact:
        typeof row.farmer === "object" && row.farmer !== null
              ? row.farmer.contact_no
              : row.farmer,
      }))
    : [];

  return (
    <>
      <div style={{ width: "100%" }}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pageSizeOptions={[10, 20, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          density="compact"
          disableColumnResize
          disableRowSelectionOnClick
        />
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete land record of{" "}
          <strong>{selectedFarmer}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LandsDataGrid;
