import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Grid,
  Card,
  CardContent,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useState } from "react";

import RequestsDataGrid from "../../components/manager/RequestDataGrid";
import PaymentDataGrid from "../../components/manager/PaymentDataGrid";

export default function Dashboard() {
  const [overview] = useState({
    totalLands: 0,
    fieldOfficers: 0,
    pendingOps: 0,
    pendingPayments: 0,
  });

  const [requests] = useState([]);
  const [payments] = useState([]);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setUserName(localStorage.getItem("name") || "");
    setRole(localStorage.getItem("role") || "");
  }, []);

  // track selected tab
  // const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // fetch real data if needed
  }, []);

  // const handleTabChange = (e, newValue) => {
  //   setTabValue(newValue);
  // };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Top Nav (Tabs) */}
      {/* <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          p: 0,
          // border: "2px solid red",
          display: "flex",
          justifyContent: "left",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              minWidth: 140,
            },
          }}
        >
          <Tab label="Home" />
          <Tab label="Operations Approval" />
          <Tab label="Payments Approval" />
          <Tab label="Land Progress" />
        </Tabs>
      </Box> */}

      {/* Breadcrumbs */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          p: 3,
          ml: { xs: 0, md: 17 },
        }}
      >
        <Typography variant="h5" gutterBottom>
          Hello {userName}!
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Typography color="text.primary">
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
            Home
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* MAIN CARD: Division Overview */}
      <Paper
        elevation={5}
        sx={{
          maxWidth: 925,
          mx: "auto",
          p: 3,
          borderRadius: 5,
          mb: 3,
          backgroundColor: "#fdfdfd",
          // border: "2px solid red",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Division Overview
        </Typography>

        {/* Stat cards */}
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          {[
            { label: "Total registered lands", value: overview.totalLands },
            { label: "Assigned field officers", value: overview.fieldOfficers },
            { label: "Pending operations", value: overview.pendingOps },
            { label: "Pending payments", value: overview.pendingPayments },
          ].map((item, idx) => (
            <Grid
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

      {/* TABLES */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: 0,
          // transform: "translateX(20px)", // keep your offset
          // border: "2px solid red",
          justifyContent: "space-between",
        }}
      >
        <Grid
          container
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
          justifySelf={"center"}
          width={"97%"}
          // sx={{ p: 0, border: "2px solid red" }}
        >
          <Grid
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
                minWidth: 420,
                width: { xs: "100%", md: "auto" },
                display: "flex",
                flexDirection: "column",
                mx: "auto",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontSize: "1rem" }}
              >
                Recent Requests
              </Typography>
              <div style={{ width: "100%" }}>
                <RequestsDataGrid requests={requests} />
              </div>
            </Paper>
          </Grid>

          <Grid
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
                minWidth: 420,
                width: { xs: "100%", md: "auto" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontSize: "1rem" }}
              >
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
