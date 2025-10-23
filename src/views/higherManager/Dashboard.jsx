
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
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

import Graph from "../../components/higherManager/Graph";
import Coverage from "../../components/higherManager/Coverage";
import { getHigherManagerDashboardCardInfo } from "../../api/higherManager";
import { getUserById } from "../../api/user";

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [overview, setOverview] = useState({
    totalLands: 0,
    totalArea: 0,
    divisions: 0,
    landsInProgress: 0,
  });
  const [graphData, setGraphData] = useState([]);
  const [coverageData, setCoverageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const loggedUserId = localStorage.getItem("loggedUserId") || "";
        if (!loggedUserId) {
          if (!cancelled) setError("No logged user id found");
          setLoading(false);
          return;
        }

        const userRes = await getUserById(loggedUserId);
        if (!userRes?.data) {
          if (!cancelled) setError("Failed to load user data");
          setLoading(false);
          return;
        }

        const user = userRes.data;
        if (!cancelled) {
          setUserName(user.fullName || "");
          setRole(user.role?.name || "");

          // Use assigned land ID if exists, otherwise fallback to manager ID
        // in your Dashboard component
// ...
        const dashboardParamObj = user.land?._id ? { landId: user.land._id } : { managerId: loggedUserId };

        let overviewRes;
        try {
          // IMPORTANT: helper now returns data, not axios response
          overviewRes = await getHigherManagerDashboardCardInfo(dashboardParamObj);
        } catch (err) {
          console.error("API call failed:", err?.response?.data ?? err?.message ?? err);
          if (!cancelled) setError("Failed to load dashboard data");
          setLoading(false);
          return;
        }

        if (!overviewRes) {
          if (!cancelled) setError("No dashboard data returned");
          setLoading(false);
          return;
        }

        const data = overviewRes; // NOTE: overviewRes is the data object already
        // Map API response to local overview shape
        if (!cancelled) {
          setOverview({
            totalLands: data.overview?.totalLands ?? data.overview?.total_lands ?? data.totalLands ?? 0,
            totalArea: data.overview?.totalArea ?? data.overview?.total_area ?? data.totalArea ?? 0,
            divisions: data.overview?.divisions ?? data.overview?.totalDivisions ?? data.divisions ?? 0,
            landsInProgress: data.overview?.landsInProgress ?? data.overview?.pendingOperations ?? data.landsInProgress ?? 0,
          });

          // graphs: prefer mapped `graph` or `graphSeries` or top-level `graph`
          setGraphData(data.graph ?? data.graphSeries ?? data.series ?? []);
          setCoverageData(data.coverage ?? []);
        }

        }
      } catch (err) {
        console.error("Unexpected error:", err);
        if (!cancelled) setError("An unexpected error occurred");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  // layout constants
  const tableGroupOffset = 20;
  const tableCardMinWidth = 420;

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>
      {/* Greeting */}
      <Paper
        sx={{
          mx: "auto",
          p: 3,
          mb: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
        }}
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
          <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
          Home
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
        sx={{
          maxWidth: 925,
          mx: "auto",
          p: 3,
          borderRadius: 5,
          mb: 3,
          backgroundColor: "#fdfdfd",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Overall Overview
        </Typography>

        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
          {[
            { label: "Total lands", value: overview.totalLands },
            { label: "Total Area (Acre)", value: overview.totalArea },
            { label: "Number of Division", value: overview.divisions },
            { label: "Lands in Progress", value: overview.landsInProgress },
          ].map((item, idx) => (
            <Grid item key={idx} xs="auto" sx={{ display: "flex", justifyContent: "center" }}>
              <Card
                elevation={2}
                sx={{
                  borderRadius: 4,
                  bgcolor: "#fff",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
                  textAlign: "center",
                  minWidth: 140,
                  px: 2,
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: "700", lineHeight: 1 }}>
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

      {/* Graph and Coverage */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          transform: `translateX(${tableGroupOffset}px)`,
        }}
      >
        <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
          <Grid item xs="12" md="auto" sx={{ display: "flex", justifyContent: "center" }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #eee",
                minWidth: tableCardMinWidth,
                width: { xs: "100%", md: "auto" },
                display: "flex",
                flexDirection: "column",
                mx: "auto",
              }}
            >
              <Graph data={graphData} loading={loading} />
            </Paper>
          </Grid>

          <Grid item xs="12" md="auto" sx={{ display: "flex", justifyContent: "center" }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #eee",
                minWidth: `${tableCardMinWidth}px`,
                width: { xs: "100%", md: "auto" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Coverage data={coverageData} loading={loading} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
