// PaymentDataGrid.jsx
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

export default function PaymentDataGrid({ payments = [], onDelete }) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [rowToDelete, setRowToDelete] = React.useState(null);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");



  const handleConfirmDelete = () => {
    if (onDelete && rowToDelete) {
      onDelete(rowToDelete); // PASS THE WHOLE ROW OBJECT
      setSnackbarMessage(`Payment by "${rowToDelete.officer}" deleted successfully`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
    setOpenDialog(false);
    setRowToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setRowToDelete(null);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const columns = [
    { field: "billId", headerName: "Bill ID", flex: 1 },
    { field: "officer", headerName: "Field Officer", flex: 2 },
    { field: "accountant", headerName: "Accountant", flex: 2 },
    { field: "date", headerName: "Requested Date", flex: 2 },
    
  ];

  const rows = payments.map((pay, idx) => ({ id: idx, ...pay }));

  return (
    <>
      <div style={{ width: "100%" }}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          density="compact"
        />
      </div>

      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete payment by <strong>{rowToDelete?.officer}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
