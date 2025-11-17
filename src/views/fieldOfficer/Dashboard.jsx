
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

// API functions
import { getFieldOfficerDashboardCardInfo } from "../../api/fieldOfficer";
import { getUserById } from "../../api/user";

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
    const fetchDashboard = async () => {
      try {
        const loggedUserId = localStorage.getItem("loggedUserId") || "";
        if (!loggedUserId) return;

        // Fetch user info
        const userRes = await getUserById(loggedUserId);
        const user = userRes.data;
        setUserName(user.fullName || "");

        // Get division ID
        const divisionId = user.division?._id || "";
        if (!divisionId) {
          console.warn("No division assigned");
          return;
        }

        // Fetch Field Officer dashboard info by divisionId
        const res = await getFieldOfficerDashboardCardInfo(divisionId);
        const data = res.data;

        setOverview(data.overview || {});
        setProgress(data.progress || { pending: 0, inProgress: 0, completed: 0 });
        setUpdates(data.updates || []);
      } catch (err) {
        console.error(
          "Error fetching Field Officer Dashboard:",
          err.response?.data || err.message
        );
      }
    };

    fetchDashboard();
  }, []);

  const mainCardWidth = 925;

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
            { label: "Assigned lands", value: overview.assignedLands },
            { label: "Assigned lands in progress", value: overview.progressLand },
          ].map((item, idx) => (
            <Grid item key={idx} xs="auto" sx={{ display: "flex", justifyContent: "center" }}>
              <Card
                elevation={2}
                sx={{ borderRadius: 4, textAlign: "center", minWidth: 140, px: 2 }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
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
      <Box
        sx={{
          maxWidth: mainCardWidth,
          mx: "auto",
          px: 1,
          mt: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Progress Panel */}
        <Paper
          elevation={1}
          sx={{
            flexBasis: { xs: "100%", md: "100%" }, // full width on mobile, centered on desktop
            minWidth: 300,
            p: 3,
            borderRadius: 3,
            border: "1px solid #eee",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="subtitle1" gutterBottom sx={{ fontSize: "1rem" }}>
            Overall Progress — Assigned Lands
          </Typography>

          {["pending", "inProgress", "completed"].map((key) => (
            <Box key={key} sx={{ mt: key === "pending" ? 1 : 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress[key]}
                  sx={{ flex: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" sx={{ minWidth: 36, textAlign: "right" }}>
                  {progress[key]}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
}
