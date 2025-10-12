
// src/views/higherManager/Dashboard.jsx
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
import { fetchAndMapDashboard } from "../../api/higherManager";

function Dashboard() {
  const [userName, setUserName] = useState("");
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
    setUserName(localStorage.getItem("name") || "");
  }, []);

  useEffect(() => {
    let mounted = true;
    const higherManagerId =
      localStorage.getItem("higherManagerId") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("id");

    if (!higherManagerId) {
      setError("HigherManager ID not found in localStorage.");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // If you want cancellation you can pass an AbortSignal here via axios options: { signal }
        const { overview, graph, coverage } = await fetchAndMapDashboard(higherManagerId);
        if (!mounted) return;
        setOverview(overview);
        setGraphData(graph);
        setCoverageData(coverage);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
        if (!mounted) return;
        setError(err.message || "Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // layout constants
  const tableGroupOffset = 20;
  const tableCardMinWidth = 420;

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>
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
          Hello {userName} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back to the Agricultural Land Preparation System Dashboard.
        </Typography>
      </Paper>

      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", pl: 2 }}>
        <Typography color="text.primary">
          <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
          Home
        </Typography>
      </Breadcrumbs>

      {error && (
        <Box sx={{ maxWidth: 925, mx: "auto", mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

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

export default Dashboard;
