// LandDataGrid.jsx
import * as React from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const LandDataGrid = ({ data }) => {

  const navigate = useNavigate();

  const columns = [
    { field: "_id", headerName: "Land ID", flex: 1, minWidth: 130 },
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
      field: "taskProgressPercent",
      headerName: "Current Task Progress",
      flex: 1.8,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const value = Math.max(0, Math.min(100, params?.row.taskProgressPercent ?? 0));
        return (
          <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress variant="determinate" value={value} />
            </Box>
            <Box sx={{ minWidth: 40 }}>
              <Typography variant="body2">{`${Math.round(value)}%`}</Typography>
            </Box>
          </Box>
        );
      },
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
