

import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { getFieldOfficerDashboardCardInfo } from "../../api/fieldOfficer"; // ✅ NEW API helper

export default function FieldOfficerDashboard() {
  const [userName, setUserName] = useState("");
  const [overview, setOverview] = useState({
    totalLands: 0,
    farmers: 0,
    assignedLands: 0,
    progressLand: 0,
  });
  const [progress, setProgress] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    setUserName(localStorage.getItem("name") || "");

    const fetchData = async () => {
      try {
        const landId = localStorage.getItem("landId"); // ✅ example: use logged-in officer’s landId
        if (!landId) return;

        const res = await getFieldOfficerDashboardCardInfo(landId);
        const data = res.data;

        setOverview(data.overview || {});
        setProgress(data.progress || { pending: 0, inProgress: 0, completed: 0 });
        setUpdates(data.updates || []);
      } catch (err) {
        console.error("Error fetching Field Officer Dashboard:", err);
      }
    };

    fetchData();
  }, []);

  const mainCardWidth = 925;
  const handleAddNewLand = () => {
    console.log("Add New Land clicked");
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Greeting Card */}
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
      </Box>

      {/* Add Land Button */}
      <Box
        sx={{
          maxWidth: mainCardWidth,
          mx: "auto",
          px: 2,
          mb: 1,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNewLand}
          sx={{ borderRadius: 20, px: 3, textTransform: "none" }}
        >
          Add New Land
        </Button>
      </Box>

      {/* Stat Cards */}
      <Paper
        elevation={5}
        sx={{
          maxWidth: mainCardWidth,
          mx: "auto",
          p: 3,
          borderRadius: 5,
          mb: 3,
          backgroundColor: "#fdfdfd",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Division Overview
        </Typography>

        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {[
            { label: "Total registered lands", value: overview.totalLands },
            { label: "Total registered farmers", value: overview.farmers },
            { label: "Your assigned lands", value: overview.assignedLands },
            { label: "Your lands in progress", value: overview.progressLand },
          ].map((item, idx) => (
            <Grid item key={idx} xs="auto">
              <Card
                elevation={2}
                sx={{
                  borderRadius: 4,
                  textAlign: "center",
                  minWidth: 140,
                  px: 2,
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: "700", lineHeight: 1 }}>
                    {item.value}
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

      {/* Progress + Updates */}
      <Box sx={{ maxWidth: mainCardWidth, mx: "auto", px: 1, mt: 2 }}>
        <Grid container spacing={3}>
          {/* Progress */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #eee" }}>
              <Typography variant="subtitle1" gutterBottom>
                Overall Progress — Assigned Lands
              </Typography>

              {["pending", "inProgress", "completed"].map((key) => (
                <Box key={key} sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress[key]}
                      sx={{ flex: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2">{progress[key]}%</Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Updates */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #eee" }}>
              <Typography variant="subtitle2" gutterBottom>
                Recent Updates
              </Typography>

              <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                {updates.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No updates yet.
                  </Typography>
                ) : (
                  updates.map((u, i) => (
                    <Box
                      key={u.id}
                      sx={{
                        py: 0.6,
                        borderTop: i === 0 ? "none" : "1px solid #f2f2f2",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {u.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {u.time}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
