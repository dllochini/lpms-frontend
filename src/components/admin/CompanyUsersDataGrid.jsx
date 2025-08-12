import * as React from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { deleteUserById } from "../../api/user";
import { useState } from "react";

const BasicDataGrid = ({ data, onDelete }) => {
  const navigate = useNavigate();

  // State for dialog open + user id to delete
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");

  const handleDeleteClick = (id) => {
    const user = data.find((u) => u._id === id);
    setSelectedUserName(user ? user.fullName : "");
    setSelectedId(id);
    setOpenDialog(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        await deleteUserById(selectedId);
        if (onDelete) {
          onDelete(selectedId);
        }
      } catch (error) {
        console.error("Delete failed:", error);
        // optionally show a toast/snackbar for failure
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

  // Edit handler to redirect
  const handleEditClick = (id) => {
    navigate(`/user/edit/${id}`);
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 3 },
    {
      field: "designation",
      headerName: "Designation",
      headerAlign: "left",
      align: "left",
      flex: 1,
    },
    {
      field: "fullName",
      headerName: "Full Name",
      headerAlign: "left",
      align: "left",
      flex: 4,
    },
    {
      field: "role",
      headerName: "Role",
      headerAlign: "left",
      align: "left",
      flex: 2,
    },
    {
      field: "email",
      headerName: "Email",
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
        // If role is an object, use its 'role' property; otherwise, use as is
        role:
          typeof row.role === "object" && row.role !== null
            ? row.role.role
            : row.role,
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
          Are you sure you want to delete <strong>{selectedUserName}</strong>{" "}
          user?
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
