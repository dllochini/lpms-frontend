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
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useState } from "react";

import RequestsDataGrid from "../../components/manager/RequestDataGrid";
import PaymentDataGrid from "../../components/manager/PaymentDataGrid";

export default function ManagerDashboard() {
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
    <Box sx={{ mb: 4 }}>
      {/* Top Nav */}
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 2 }}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" size="small" sx={{ borderRadius: 20, px: 3 }}>
            Home
          </Button>
          <Button variant="outlined" size="small" sx={{ borderRadius: 20, px: 3 }}>
            Operations Approval
          </Button>
          <Button variant="outlined" size="small" sx={{ borderRadius: 20, px: 3 }}>
            Payments Approval
          </Button>
          <Button variant="outlined" size="small" sx={{ borderRadius: 20, px: 3 }}>
            Land Progress
          </Button>
        </Stack>
      </Box>

      {/* Breadcrumbs */}
      <Box
          sx={{
            maxWidth: 1100,
            mx: "auto",
            p: 3,
            // nudge left on md+ screens (md: -2 => -16px). Increase absolute value for bigger shift.
            ml: { xs: 0, md: 17 },
          }}
        >
          <Typography variant="h5" gutterBottom>Hello Manager!</Typography>
          <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
            <Typography color="text.primary">
              <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
              Home
            </Typography>
          </Breadcrumbs>
        </Box>

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
          Division Overview
        </Typography>

        {/* Center the small stat cards as a group */}
        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
          {[
            { label: "Total registered lands", value: overview.totalLands },
            { label: "Assigned field officers", value: overview.fieldOfficers },
            { label: "Pending operations", value: overview.pendingOps },
            { label: "Pending payments", value: overview.pendingPayments },
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
          <Grid item xs="auto" md="auto" sx={{ display: "flex", justifyContent: "center" }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #eee",
                minWidth: tableCardMinWidth,       // number is treated as px by MUI
                width: { xs: "100%", md: "auto" }, // full width on small screens, auto on md+
                display: "flex",
                flexDirection: "column",
                mx: "auto",                        // centers the Paper inside the grid cell
              }}
            >
              <Typography variant="subtitle1" gutterBottom sx={{ fontSize: "1rem" }}>
                Recent Requests
              </Typography>

              <div style={{ width: "100%" }}>
                <RequestsDataGrid requests={requests} />
              </div>
            </Paper>
          </Grid>


          {/* Payments card (auto-sized) */}
          <Grid item xs={12} md="auto" sx={{ display: "flex", justifyContent: "center" }}>
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
              <Typography variant="subtitle1" gutterBottom sx={{ fontSize: "1rem" }}>
                Recent Payments
              </Typography>

              <div style={{ width: "100%" }}>
                <PaymentDataGrid payments={payments} />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
