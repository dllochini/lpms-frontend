import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";

const PaymentDataGrid = ({
  rows = [],
  onViewDetails = () => {},
  loading = false,
}) => {
  // Build rows for the grid but keep the original bill object so the dialog gets the full data
  const formattedBills = rows.map((b) => ({
    _id: b._id,
    billId: b._id,
    landId: b.process?.land?._id || "N/A",
    fieldOfficer: b.process?.land?.createdBy?.fullName || "N/A",
    requestedDate: b.process?.endDate ? new Date(b.process.endDate).toLocaleDateString() : "N/A",
    totalAmount: b.totalAmount ?? 0,
    originalBill: b, // keep full object
  }));

  const columns = [
    { field: "billId", headerName: "Bill ID", flex: 1 },
    { field: "landId", headerName: "Land ID", flex: 1 },
    { field: "fieldOfficer", headerName: "Field Officer", flex: 2 },
    { field: "requestedDate", headerName: "Requested Date", flex: 1.5 },
    {
      field: "totalAmount",
      headerName: "Total (LKR)",
      flex: 1.2,
      align: "right",
      headerAlign: "right",
      // valueGetter: (params) => Number(params.row.totalAmount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 }),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            // pass the original bill object so the dialog has all nested data
            onViewDetails(params.row.originalBill || params.row);
          }}
        >
          VIEW DETAILS
        </Button>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={formattedBills}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        pageSizeOptions={[5, 10]}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default PaymentDataGrid;
