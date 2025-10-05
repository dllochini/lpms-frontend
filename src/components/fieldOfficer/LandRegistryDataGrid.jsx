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

import { useState } from "react";
import { deleteLandById } from "../../api/land";
import { useNavigate } from "react-router-dom";

const LandRegistryDataGrid = ({ data, onDelete }) => {
  console.log("Data in LandRegistryDataGrid:", data);
  const navigate = useNavigate();
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        await deleteLandById(selectedId);
        if (onDelete) {
          onDelete(selectedId);
        }
        setSnackbarMessage(`Land "${selectedId}" deleted successfully`);
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
    navigate(`/fieldOfficer/landEdit1/${id}`);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const columns = [
    { field: "id", headerName: "Land ID", flex: 3 },
    {
      field: "farmer",
      headerName: "Farmer",
      headerAlign: "left",
      align: "left",
      flex: 4,
    },
    {
      field: "address",
      headerName: "Address",
      headerAlign: "left",
      align: "left",
      flex: 4,
    },
    {
      field: "area",
      headerName: "Area",
      headerAlign: "left",
      align: "left",
      flex: 2,
    },
    {
      field: "contactNo",
      headerName: "Contact Number",
      headerAlign: "left",
      align: "left",
      flex: 4,
    },
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
      sortable: false,
      filterable: false,
    },
  ];

  const rows = Array.isArray(data)
    ? data.map((land) => ({
        id: land._id, // ✅ From backend
        farmer: land.farmer?.fullName || land.user?.fullName || "N/A",
        contactNo:
          land.farmer?.contactNo ||
          land.farmer?.contact_no ||
          land.user?.contact_no ||
          "N/A",
        address: land.address || land.location || "N/A",
        area: `${land.size} ${land.unit?.symbol || ""}`,
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
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          disableColumnResize
          checkboxSelection={false}
          disableRowSelectionOnClick
        />
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{selectedId}</strong> land?
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

      {/* Snackbar to show the deletion success */}
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

export default LandRegistryDataGrid;
