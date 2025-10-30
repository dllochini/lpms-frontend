// PaymentDataGrid.jsx
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function PaymentDataGrid({ payments = [] }) {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage] = React.useState("");
  const [snackbarSeverity] = React.useState("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const columns = [
    { field: "id", headerName: "Bill ID", flex: 1.5 },
    { field: "fieldOfficer", headerName: "Field Officer", flex: 2 },
    { field: "amount", headerName: "Total (LKR)", flex: 2 },
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
          initialState={{ pagination: { paginationModel: { pageSize: 5} } }}
          density="compact"
          disableColumnMenu
          disableRowSelectionOnClick
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#fafafa",
            },
          }}
        />
      </div>

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


