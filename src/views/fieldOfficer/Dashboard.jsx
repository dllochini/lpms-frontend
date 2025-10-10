import React from "react";
import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  LinearProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FieldOfficerDashboard() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(localStorage.getItem("name") || "");
  }, []);

  const [overview] = useState({
    totalLands: 0,
    farmers: 0,
    assignedLands: 0,
    progressLand: 0,
  });

  // sample progress values (0-100)
  const [progress] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  // sample recent updates (replace with real data / fetch)
  const [updates] = useState([
    { id: 1, title: "New land created - L1234", time: "2 hours ago" },
  ]);

  useEffect(() => {
    // fetch real data if needed
  }, []);

  const mainCardWidth = 925;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Breadcrumbs/title */}
      <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>
        {/* Greeting Card */}
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
          onClick={() => navigate("/fieldOfficer/landRegistration1")}
          sx={{ borderRadius: 20, px: 3, textTransform: "none" }}
        >
          Add New Land
        </Button>
      </Box>

      {/* MAIN CARD: ONLY the 4 small stat cards */}
      <Paper
        elevation={5}
        sx={{
          maxWidth: mainCardWidth,
          mx: "auto",
          p: 3,
          borderRadius: 5,
          mb: 3,
          backgroundColor: "#fdfdfd",
          overflow: "visible",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Division Overview
        </Typography>

        {/* Small stat cards (centered group) */}
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {[
            { label: "Total registered lands", value: overview.totalLands },
            { label: "Total registerd farmers", value: overview.farmers },
            { label: "Your assigned lands", value: overview.assignedLands },
            { label: "Your lands in progress", value: overview.progressLand },
          ].map((item, idx) => (
            <Grid
              item
              key={idx}
              xs="auto"
              sx={{ display: "flex", justifyContent: "center" }}
            >
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
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "700", lineHeight: 1 }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {item.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* OUTSIDE CARDS: Progress and Recent Updates (aligned to mainCardWidth) */}
      <Box sx={{ maxWidth: mainCardWidth, mx: "auto", px: 1, mt: 2 }}>
        <Grid container spacing={3}>
          {/* Overall Progress Assigned Lands (outside main card) */}
          <Grid item xs={12} md={15} sx={{ display: "flex" }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #eee",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontSize: "1rem" }}
              >
                Overall Progress — Assigned Lands
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={progress.pending}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ minWidth: 36, textAlign: "right" }}
                  >
                    {progress.pending}%
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  In progress
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={progress.inProgress}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ minWidth: 36, textAlign: "right" }}
                  >
                    {progress.inProgress}%
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress.completed}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ minWidth: 36, textAlign: "right" }}
                  >
                    {progress.completed}%
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Updates (outside main card) */}
          {/* Recent Updates — compact, screenshot-style list */}
          <Grid item xs={12} md={30} sx={{ display: "flex" }}>
            <Paper
              elevation={0}
              sx={{
                p: 1.25, // tighter padding like screenshot
                borderRadius: 3,
                border: "1px solid #eee",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontSize: "0.95rem", fontWeight: 600 }}
              >
                Recent Updates
              </Typography>

              {/* Scrollable list area with fixed max height */}
              <Box
                sx={{
                  mt: 0.5,
                  maxHeight: 200, // adjust to match screenshot height
                  overflowY: "auto",
                }}
              >
                {/* Data rows */}
                {updates.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 1 }}
                  >
                    No updates yet.
                  </Typography>
                ) : (
                  updates.map((u, i) => (
                    <Box
                      key={u.id}
                      sx={{
                        px: 0.5,
                        py: 0.6,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        borderTop: i === 0 ? "none" : "1px solid #f2f2f2",
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        {/* truncated update text */}
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            lineHeight: 1.1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={u.title}
                        >
                          {u.title}
                        </Typography>
                      </Box>

                      <Box sx={{ flexShrink: 0, ml: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: 11 }}
                        >
                          {u.time}
                        </Typography>
                      </Box>
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
