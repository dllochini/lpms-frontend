
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  // --- ADDED Table Imports ---
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"; // <-- MODIFIED
import HomeIcon from "@mui/icons-material/Home";

import Graph from "../../components/higherManager/Graph";
import TaskSummary from "../../components/higherManager/TaskSummary";
import { getHigherManagerDashboardCardInfo } from "../../api/higherManager";
import { getUserById } from "../../api/user";

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  // const [division, setDivision] = useState(""); // <-- REMOVED (No longer needed for API call)
  const [overview, setOverview] = useState({
    totalLands: 0,
    totalArea: 0,
    divisions: 0,
    landsInProgress: 0,
  });
  const [graphData, setGraphData] = useState([]);
  const [TaskSummaryData, setTaskSummaryData] = useState({});
  const [divisionData, setDivisionData] = useState([]); // <-- ADDED: State for the new table
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const loggedUserId = localStorage.getItem("loggedUserId") || "";
        if (!loggedUserId) {
          setError("No logged user id found");
          return;
        }

        const userRes = await getUserById(loggedUserId);
        if (!userRes?.data) {
          setError("Failed to load user data");
          return;
        }

        const user = userRes.data;
        setUserName(user.fullName || "");
        setRole(user.role?.name || "");

        // --- MODIFIED API Call ---
        // We no longer pass a specific divisionId. We want data for *all* divisions
        // this manager oversees.
        // We assume the API backend is updated to handle this.
        const dashboardRes = await getHigherManagerDashboardCardInfo(); // <-- MODIFIED
        const data = dashboardRes?.data;
        if (!data) {
          setError("No dashboard data returned");
          return;
        }

        setOverview(data.overview || {
          totalLands: 0,
          totalArea: 0,
          divisions: 0,
          landsInProgress: 0,
        });

        setGraphData(data.graph ?? []);
        setTaskSummaryData(data.progress ?? {});

        // --- ADDED: Set data for the new table ---
        // We assume the API response now includes a 'divisionPerformance' array
        setDivisionData(data.divisionPerformance || []); // <-- ADDED
        
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        const msg = err?.response?.data?.message ?? err?.message ?? "Unexpected error";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>
      {/* Greeting */}
      <Paper
        sx={{ mx: "auto", p: 3, mb: 3, borderRadius: 4, background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)" }}
        elevation={0}
      >
        <Typography variant="h5" gutterBottom>
          Hello {userName || (loading ? <CircularProgress size={20} /> : "User")} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back to the Agricultural Land Preparation System Dashboard.
        </Typography>
      </Paper>

      {/* Breadcrumb */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", pl: 2 }}>
        <Typography color="text.primary">
          <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} /> Home
        </Typography>
      </Breadcrumbs>

      {/* Error */}
      {error && (
        <Box sx={{ maxWidth: 925, mx: "auto", mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Overview Cards */}
      <Paper
        elevation={5}
        sx={{ maxWidth: 925, mx: "auto", p: 3, borderRadius: 5, mb: 3, backgroundColor: "#fdfdfd" }}
      >
        <Typography variant="h6" gutterBottom>Division Overview</Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {[
            { label: "Total lands", value: overview.totalLands },
            { label: "Total Area (Acre)", value: overview.totalArea },
            { label: "Number of Divisions", value: overview.divisions },
            { label: "Lands in Progress", value: overview.landsInProgress },
          ].map((item, idx) => (
            <Grid item key={idx} xs="auto" sx={{ display: "flex", justifyContent: "center" }}>
              <Card elevation={2} sx={{ borderRadius: 4, bgcolor: "#fff", textAlign: "center", minWidth: 140, px: 2 }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {loading ? <CircularProgress size={22} /> : item.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {item.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* --- ADDED: Division Performance Table --- */}
      <Paper 
        elevation={5}
        sx={{ maxWidth: 925, mx: "auto", p: 3, borderRadius: 5, mb: 3, backgroundColor: "#fdfdfd" }}
      >
        <Typography variant="h6" gutterBottom>Division Performance</Typography>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="division performance table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Division Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Lands in Progress</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>% Complete</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Overdue Tasks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                   <TableCell colSpan={4} align="center">
                     <Typography color="error">Could not load division data.</Typography>
                   </TableCell>
                 </TableRow>
              ) : divisionData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No division performance data found.
                  </TableCell>
                </TableRow>
              ) : (
                divisionData.map((row) => (
                  <TableRow
                    key={row.divisionName}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.divisionName}
                    </TableCell>
                    <TableCell align="right">{row.landsInProgress}</TableCell>
                    <TableCell align="right">{row.percentComplete}%</TableCell>
                    <TableCell align="right">{row.overdueTasks}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* --- END of new table --- */}


      {/* Graph & Coverage */}
      <Box sx={{ maxWidth: 1000, mx: "auto" }}>
        <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
          <Grid item xs="12" md="6" sx={{ display: "flex", justifyContent: "center" }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #eee", minWidth: 420, display: "flex", flexDirection: "column", mx: "auto" }}>
              <Graph data={graphData} loading={loading} />
            </Paper>
          </Grid>

          <Grid item xs="12" md="6" sx={{ display: "flex", justifyContent: "center" }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #eee", minWidth: 420, display: "flex", flexDirection: "column" }}>
              <TaskSummary data={TaskSummaryData} loading={loading} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}