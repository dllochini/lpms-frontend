import React, { useMemo } from "react";
import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { DataGrid } from "@mui/x-data-grid";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useGetDivLands } from "../../hooks/land.hooks";
import { useGetAllTasks } from "../../hooks/task.hooks";

export default function DivisionProgress() {
  const navigate = useNavigate();
  const managerId = localStorage.getItem("loggedUserId");

  const { data: divLand = [], isLoading: isLoadingLands } = useGetDivLands(managerId, {
    onError: (err) => console.error("Failed to fetch lands for manager", err),
  });

  const { data: taskData = [], isLoading: isLoadingTasks } = useGetAllTasks(undefined, {
    onError: (err) => console.error("Failed to fetch tasks", err),
  });

  const loading = isLoadingLands || isLoadingTasks;

  // Prepare rows: find most recent task per land
  const rows = useMemo(() => {
    if (!Array.isArray(divLand)) return [];

    return divLand.map((land, index) => {
      const tasksForLand = Array.isArray(taskData)
        ? taskData.filter((t) => {
            const taskLand = t?.process?.land ?? (t?.process?.land?._id);
            return String(taskLand) === String(land?._id);
          })
        : [];

      // sort descending by startDate (fallback to createdAt)
      tasksForLand.sort((a, b) => {
        const aDate = a?.startDate ? new Date(a.startDate) : a?.createdAt ? new Date(a.createdAt) : new Date(0);
        const bDate = b?.startDate ? new Date(b.startDate) : b?.createdAt ? new Date(b.createdAt) : new Date(0);
        return bDate - aDate;
      });

      const recentTask = tasksForLand[0] ?? null;

      return {
        id: index + 1,
        landId: land?._id ?? `land-${index + 1}`,
        fieldOfficer: land?.createdBy?.fullName ?? land?.assignedTo?.fullName ?? "N/A",
        area: land?.size ?? "-",
        currentStatus: recentTask?.status ?? "No Task",
        currentOperation: recentTask?.operation?.name ?? "—",
      };
    });
  }, [divLand, taskData]);

  const handleViewDetails = (landId) => {
    navigate(`/manager/viewProgress/${landId}`);
  };

  const columns = [
    { field: "landId", headerName: "Land ID", flex: 1, headerAlign: "center", align: "center" },
    { field: "fieldOfficer", headerName: "Field Officer", flex: 1.2, headerAlign: "center", align: "center" },
    { field: "area", headerName: "Area (Acre)", flex: 1, headerAlign: "center", align: "center" },
    { field: "currentStatus", headerName: "Current Status", flex: 1.2, headerAlign: "center", align: "center" },
    { field: "currentOperation", headerName: "Current Operation", flex: 1.5, headerAlign: "center", align: "center" },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => handleViewDetails(params?.row?.landId)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Division Progress
      </Typography>

      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", mb: 2 }}>
        <Link
          component={RouterLink}
          to="/manager"
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} /> Home
        </Link>
        <Typography color="text.primary">Land Progress</Typography>
      </Breadcrumbs>

      <Paper elevation={5} sx={{ p: 2, borderRadius: 3 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          getRowId={(row) => row.landId ?? row.id}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
        />
      </Paper>

    </Box>
  );
}
