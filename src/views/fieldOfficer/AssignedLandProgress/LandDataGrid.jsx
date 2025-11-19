import React from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const LandDataGrid = ({ data }) => {

  const navigate = useNavigate();

  const columns = [
    { field: "_id", headerName: "Land ID", flex: 1, minWidth: 130 },
  
    {
      field: "address",
      headerName: "Address",
      flex: 1.5,
    },
    { field: "size", headerName: "Area (acre)", flex: 1, minWidth: 110 },
    {
      field: "taskName",
      headerName: "Current Task Name",
      flex: 1.5,
    },
    {
      field: "status",
      headerName: "Current Status",
      flex: 1.5,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      flex: 0.9,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => navigate(`/fieldOfficer/landProgressTracking/${params.row._id}`)}
          key="edit"
        />
      ],
      sortable: false,
      filterable: false,
    },
  ];

  const rows = data.map((land, idx) => ({
    id: land.landId ?? idx,
    ...land,
  }));

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        density="compact"
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default LandDataGrid;
