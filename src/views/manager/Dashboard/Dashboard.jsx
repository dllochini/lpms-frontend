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
import { getManagerDashboardCardInfo } from "../../../api/manager";
import RequestsDataGrid from "./RequestDataGrid";
import PaymentDataGrid from "./PaymentDataGrid";
import { getUserById } from "../../../api/user";

export default function Dashboard() {
  const [overview, setOverview] = useState({
    totalLands: 0,
    fieldOfficers: 0,
    pendingOps: 0,
    pendingPayments: 0,
  });

  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [div, setDivision] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      const loggedUserId = localStorage.getItem("loggedUserId") || "";
      if (!loggedUserId) return;

      try {
        const userRes = await getUserById(loggedUserId);
        // console.log(userRes, "user response");
        if (!userRes || !userRes.data) {
          console.warn("No user data returned");
          return;
        }

        const user = userRes.data;
        setUserName(user.fullName || "");
        setRole(user.role?.name || "");
        const divisionId = user.division?._id ?? user.division ?? "";
        setDivision(divisionId);
        if (!divisionId) return;

        let overviewRes;
        try {
          overviewRes = await getManagerDashboardCardInfo(divisionId);
        } catch (err) {
          console.error("API call failed:", err.response?.data || err.message);
          return;
        }

        if (!overviewRes || !overviewRes.data) {
          console.warn("No dashboard data returned");
          return;
        }

        const data = overviewRes.data;

        // console.log("data resoponse", data);

        setOverview({
          totalLands: data.totalLands || 0,
          fieldOfficers: data.totalFieldOfficers || 0,
          pendingOps: data.pendingOperations || 0,
          pendingPayments: data.pendingBills || 0,
        });

        setRequests(data.recentRequests || []);
        setPayments(data.recentPayments || []);

        // console.log("received recentRequests:", data.recentRequests);
        // console.log("received recentPayments:", data.recentPayments);
      } catch (err) {
        console.error("Error fetching dashboard:", err.response?.data || err.message);
      }
    };

    fetchDashboard();
  }, []);

  const mappedRequests = (requests || []).map((req, idx) => {

    // console.log(requests, "requests fetched")

    const landObj = req.process?.land ?? null;
    const landId = (landObj && (landObj._id ?? landObj)) ?? "";

    const assigned = req.assignedTo ?? {};
    const officer = assigned.fullName ?? (typeof assigned === "string" ? assigned : "-");

    const operation = req.operation?.name ?? "-";

    return {
      id: req._id ?? idx,
      landId,
      officer,
      operation,
      date: req.startDate ? new Date(req.startDate).toLocaleDateString() : "-",
      raw: req,
    };
  });

  // console.log(payments, "payments fetched")

  const mappedPayments = (payments || []).map((p, idx) => ({
    id: p._id ?? idx,
    amount: p.totalAmount ?? p.amount ?? "-",
    status: p.status ?? "-",
    fieldOfficer: p.process?.land?.createdBy?.fullName ?? "-",
    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-",
    raw: p,
  }));

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>
        <Paper sx={{ mx: "auto", p: 3, mb: 3, borderRadius: 4, background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)" }} elevation={0}>
          <Typography variant="h5" gutterBottom>Hello {userName} 👋</Typography>
          <Typography variant="body2" color="text.secondary">Welcome back to the Agricultural Land Preparation System Dashboard.</Typography>
        </Paper>

        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", pl: 2 }}>
          <Typography color="text.primary">
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} /> Home
          </Typography>
        </Breadcrumbs>
      </Box>

      <Paper elevation={5} sx={{ maxWidth: 925, mx: "auto", p: 3, borderRadius: 5, mb: 3, backgroundColor: "#fdfdfd" }}>
        <Typography variant="h6" gutterBottom>Division Overview</Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {[
            { label: "Total registered lands", value: overview.totalLands },
            { label: "Assigned field officers", value: overview.fieldOfficers },
            { label: "Pending operations", value: overview.pendingOps },
            { label: "Pending payments", value: overview.pendingPayments },
          ].map((item, idx) => (
            <Grid item key={idx} xs="auto" sx={{ display: "flex", justifyContent: "center" }}>
              <Card elevation={2} sx={{ borderRadius: 4, bgcolor: "#fff", boxShadow: "0 3px 6px rgba(0,0,0,0.08)", textAlign: "center", minWidth: 140, px: 2 }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>{item.value}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{item.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Box sx={{ maxWidth: 1000, mx: "auto", p: 0 }}>
        <Grid container spacing={3} justifyContent="space-between" width="97%">
          <Grid item xs="12" md="6" sx={{ display: "flex", justifyContent: "center" }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #eee", minWidth: 420, width: { xs: "100%", md: "auto" }, display: "flex", flexDirection: "column", mx: "auto" }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontSize: "1rem" }}>Recent Requests</Typography>
              <div style={{ width: "100%" }}>
                <RequestsDataGrid requests={mappedRequests} />
              </div>
            </Paper>
          </Grid>

          <Grid item xs="12" md="6" sx={{ display: "flex", justifyContent: "center" }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #eee", minWidth: 420, width: { xs: "100%", md: "auto" }, display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontSize: "1rem" }}>Recent Payments</Typography>
              <div style={{ width: "100%" }}>
                <PaymentDataGrid payments={mappedPayments} />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
