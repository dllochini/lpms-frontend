import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useState } from "react";

import Graph from "../../components/higherManager/Graph";
import Coverage from "../../components/higherManager/Coverage";

function Dashboard() {

  const [userName, setUserName] = useState("");
  
    useEffect(() => {
      setUserName(localStorage.getItem("name") || "");
    }, []);

  
  const [overview] = useState({
    totalLands: 0,
    fieldOfficers: 0,
    pendingOps: 0,
    pendingPayments: 0,
  });

  const [requests] = useState([]);
  const [payments] = useState([]);

  useEffect(() => {
    // fetch real data if needed
  }, []);

  // control the horizontal offset of the whole table-group (positive -> push right)
  const tableGroupOffset = 20; // pixels; change this to increase/decrease right-nudge
  // control width of each table card (min)
  const tableCardMinWidth = 420;

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>
      {/* Breadcrumbs */}
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

      {/* MAIN CARD: Division Overview (only small stat cards) */}
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

        {/* Center the small stat cards as a group */}
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          {[
            { label: "Total lands", value: overview.totalLands },
            { label: "Total Area(Acres)", value: overview.fieldOfficers },
            { label: "Number of Division", value: overview.pendingOps },
            { label: "Lands in Progress", value: overview.pendingPayments },
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

      {/* ---------------------------
          TABLES: OUTSIDE the MAIN CARD,
          centered under it but nudged slightly to the right
          --------------------------- */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          // transform nudges the whole group to the right by tableGroupOffset px.
          // On small screens this transform still applies but cards will stack.
          transform: `translateX(${tableGroupOffset}px)`,
        }}
      >
        <Grid
          container
          spacing={3}
          justifyContent="center" // center the group under the main card
          alignItems="flex-start"
        >
          {/* Requests card (auto-sized) */}
          {/* centered, auto-sized card */}
          <Grid
            item
            xs="auto"
            md="auto"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #eee",
                minWidth: tableCardMinWidth, // number is treated as px by MUI
                width: { xs: "100%", md: "auto" }, // full width on small screens, auto on md+
                display: "flex",
                flexDirection: "column",
                mx: "auto", // centers the Paper inside the grid cell
              }}
            >
              <div style={{ width: "100%" }}>
                <Graph />
              </div>
            </Paper>
          </Grid>

          {/* Payments card (auto-sized) */}
          <Grid
            item
            xs={12}
            md="auto"
            sx={{ display: "flex", justifyContent: "center" }}
          >
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
              <div style={{ width: "100%" }}>
                <Coverage />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;
