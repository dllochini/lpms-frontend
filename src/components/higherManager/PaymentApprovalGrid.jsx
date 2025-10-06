import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";

const PendingPaymentDataGrid = ({ rows = [], onViewDetails = () => {} }) => {
  const columns = [
    { field: "billId", headerName: "Bill ID", flex: 1 },
    { field: "landId", headerName: "Land ID", flex: 1 },
    { field: "fieldOfficer", headerName: "Field Officer", flex: 2 },
    { field: "accountant", headerName: "Accountant", flex: 2 },
    { field: "requestedDate", headerName: "Requested Date", flex: 1.5 },
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
            e.stopPropagation(); // <- prevents DataGrid row click from swallowing the event
            console.log("VIEW DETAILS clicked for row:", params.row);
            onViewDetails(params.row);
          }}
        >
          VIEW DETAILS
        </Button>
      )
    }
  ];

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default PendingPaymentDataGrid;
