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
import { deleteResourceById } from "../../api/resources";

const BasicDataGrid = ({ data, onDelete, onEdit }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedResourceName, setSelectedResourceName] = useState("");

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Open confirmation dialog
  const handleDeleteClick = (id) => {
    const resource = data.find((r) => r._id === id);
    setSelectedResourceName(resource ? resource.resource : "");
    setSelectedId(id);
    setOpenDialog(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        await deleteResourceById(selectedId);
        if (onDelete) {
          onDelete(selectedId);
        }
        setSnackbarMessage(
          `Resource "${selectedResourceName}" deleted successfully`
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Delete failed:", error);
        setSnackbarMessage("Failed to delete resource");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
    setOpenDialog(false);
    setSelectedId(null);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  // Edit resource
  const handleEditClick = (id) => {
    const resource = data.find((r) => r._id === id);
    if (onEdit) onEdit(resource);
  };

  const columns = [
    { field: "_id", headerName: "Resource ID", flex: 2 },
    { field: "resource", headerName: "Resource_Name", flex: 3 },
    { field: "category", headerName: "Category", flex: 1.5 },
    { field: "unit", headerName: "Unit of Measure", flex: 1.5 },
    { field: "description", headerName: "Description", flex: 3 },
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
          showInMenu={false}
          key="edit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.id)}
          showInMenu={false}
          key="delete"
        />,
      ],
      sortable: false,
      filterable: false,
    },
  ];

  const rows = Array.isArray(data)
    ? data.map((row) => ({
        id: row._id,
        ...row,
        unit:
          typeof row.unit === "object" && row.unit !== null
            ? row.unit.name
            : row.unit,
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
          checkboxSelection={false}
          disableRowSelectionOnClick
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete resource{" "}
          <strong>{selectedResourceName}</strong>?
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

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BasicDataGrid;
