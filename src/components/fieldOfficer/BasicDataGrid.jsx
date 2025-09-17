

import * as React from "react";
import { DataGrid as MuiDataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import { useState } from "react";

const BasicDataGrid = ({ data, onDelete, onEdit }) => {
  // Delete dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");

  // Delete handlers
  const handleDeleteClick = (id) => {
    const user = data.find((u) => u._id === id);
    setSelectedUserName(user ? user.fullName : "");
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        // await deleteOperationById(selectedId);
        if (onDelete) {
          onDelete(selectedId);
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  // Edit handler
  const handleEditClick = (id) => {
    const row = data.find((u) => u._id === id);
    if (onEdit && row) {
      onEdit(row);
    }
  };

  // Columns config
  const columns = [
    { field: "_id", headerName: "Operation ID", flex: 4 },
    {
      field: "name",
      headerName: "Operation Name",
      flex: 3,
    },
    // {
    //   field: "relatedMachines",
    //   headerName: "Related Machines",
    //   flex: 3,
    // },
    // {
    //   field: "relatedImplements",
    //   headerName: "Related Implements",
    //   flex: 3,
    // },
    {
      field: "note",
      headerName: "Note",
      flex: 3,
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
    ? data.map((row) => ({
        id: row._id,
        ...row,
      }))
    : [];

  return (
    <>
      <div style={{ width: "100%" }}>
        <MuiDataGrid
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{selectedUserName}</strong>?
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

export default BasicDataGrid;


