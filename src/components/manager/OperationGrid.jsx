import * as React from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/icons-material/Add";
import { useState } from "react";

// Replace this with your actual resources API
// import { deleteResourceById } from "../../api/resources";

const OperationGrid= ({ data, onDelete, onEdit, onView }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Open confirmation dialog
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      // Call your API to delete the resource
      // await deleteResourceById(selectedId);

      // Update parent state
      if (onDelete) onDelete(selectedId);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setOpenDialog(false);
      setSelectedId(null);
    }
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
    { field: "_id", headerName: "LandID", flex: 2 },
    { field: "fieldOfficer", headerName: "Field Officer", flex: 2 },
    { field: "operation", headerName: "Operation", flex: 1.5 },
    { field: "startDate", headerName: "Start Date", flex: 1.5 },
    { field: "compeledDate", headerName: "Requested/Completed Date", flex: 2 },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      flex: 2,
      getActions: (params) => [

          <Button
            variant="contained"
            color="primary"
            // onClick={handleEditClick}
            onClick={() => onView(params.row)} // ← call parent handleViewDetails
            sx={{ mb: 2,display: "flex", alignItems: "center" , justifyContent: "center" }}
          
          >
            view Details
          </Button>


        
      ],
      sortable: false,
      filterable: false,
    },
  ];

const rows = Array.isArray(data)
  ? data.map((row) => ({
      id: row._id,
      ...row,
      unit: row.unitID?.name || row.unitID || 'N/A', // fallback if name not populated
    }))
  : [];


  return (
    <>
      <div style={{ width: "100%" }}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          rowHeight={100}
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
          Are you sure you want to delete resource <strong>{selectedId}</strong>?
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
    </>
  );
};

export default OperationGrid;
