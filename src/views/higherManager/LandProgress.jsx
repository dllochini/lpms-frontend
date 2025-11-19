import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { DataGrid } from "@mui/x-data-grid";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function LandProgress() {
  const [rows, setRows] = useState([]);
  const [divisionFilter, setDivisionFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    setRows([
      {
        id: "B1234",
        landId: "B1234",
        farmer: "Alex Jones",
        division: "DivA",
        area: 20,
        overallProgress: 100,
      },
      {
        id: "B1235",
        landId: "B1235",
        farmer: "Chris Smith",
        division: "DivB",
        area: 15,
        overallProgress: 70,
      },
      {
        id: "B1236",
        landId: "B1236",
        farmer: "Emma White",
        division: "DivA",
        area: 25,
        overallProgress: 50,
      },
    ]);
  }, []);

  const handleViewDetails = (landId) => {
    navigate(`/higherManager/LandProgressTrack/${landId}`);
  };

  const filteredRows =
    divisionFilter === "All"
      ? rows
      : rows.filter((row) => row.division === divisionFilter);

  const columns = [
    {
      field: "landId",
      headerName: "Land ID",
      width: 170,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "farmer",
      headerName: "Farmer",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "division",
      headerName: "Division",
      width: 170,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "area",
      headerName: "Area (Acres)",
      width: 170,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "overallProgress",
      headerName: "Overall Progress",
      width: 270,
      headerAlign: "center",
      align: "center",
      display: "flex",
      renderCell: (params) => (
        <Stack sx={{ width: "100%", display: "flex" }} alignItems="center">
          <LinearProgress
            variant="determinate"
            value={params.row.overallProgress}
            sx={{ width: "80%", height: 8, borderRadius: 5 }}
          />
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {params.row.overallProgress}%
          </Typography>
        </Stack>
      ),
    },

    {
      field: "actions",
      headerName: "Action",
      width: 170,
      headerAlign: "center",
      align: "center",
      display: "flex",
      renderCell: (params) => (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleViewDetails(params.row.landId)}
          >
            View Details
          </Button>
        </Box>
      ),
    }

  ];

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Land Progress
      </Typography>

      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", mb: 2 }}>
        <Link
          component={RouterLink}
          to="/higherManager"
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} /> Home
        </Link>
        <Typography color="text.primary">Operations Approval</Typography>
      </Breadcrumbs>

      {/* Division Filter */}
      <Stack direction="row" justifyContent="flex-start" sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Division</InputLabel>
          <Select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="DivA">DivA</MenuItem>
            <MenuItem value="DivB">DivB</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Data Table */}
      <Paper elevation={5} sx={{ p: 2, borderRadius: 3 }}>
        <div style={{ height: 300, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
          />
        </div>
      </Paper>
    </Box>
  );
}
