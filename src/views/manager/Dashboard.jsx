// import {
//   Typography,
//   Box,
//   Paper,
//   Breadcrumbs,
//   Grid,
//   Card,
//   CardContent,
// } from "@mui/material";
// import HomeIcon from "@mui/icons-material/Home";
// import { useEffect, useState } from "react";
// import { getManagerDashboardCardInfo } from "../../api/manager";
// import RequestsDataGrid from "../../components/manager/RequestDataGrid";
// import PaymentDataGrid from "../../components/manager/PaymentDataGrid";
// import { getUserById } from "../../api/user";

// export default function Dashboard() {
//   const [overview, setOverview] = useState({
//     totalLands: 0,
//     fieldOfficers: 0,
//     pendingOps: 0,
//     pendingPayments: 0,
//   });

//   const [requests, setRequests] = useState([]); // raw API array (tasks)
//   const [payments, setPayments] = useState([]); // raw API array (bills)
//   const [userName, setUserName] = useState("");
//   const [role, setRole] = useState("");
//   const [div, setDivision] = useState("");

//   // Fetch dashboard overview data
//   useEffect(() => {
//     const fetchDashboard = async () => {
//       const loggedUserId = localStorage.getItem("loggedUserId") || "";
//       if (!loggedUserId) return;

//       try {
//         const userRes = await getUserById(loggedUserId);

//         if (!userRes || !userRes.data) {
//           console.warn("No user data returned");
//           return;
//         }

//         const user = userRes.data;
//         setUserName(user.fullName || "");
//         setRole(user.role?.name || "");

//         const divisionId = user.division?._id || "";
//         setDivision(divisionId);

//         if (!divisionId) return;

//         let overviewRes;
//         try {
//           overviewRes = await getManagerDashboardCardInfo(divisionId);
//         } catch (err) {
//           console.error("API call failed:", err.response?.data || err.message);
//           return;
//         }

//         if (!overviewRes || !overviewRes.data) {
//           console.warn("No dashboard data returned");
//           return;
//         }

//         const data = overviewRes.data;

//         // set card overview numbers
//         setOverview({
//           totalLands: data.totalLands || 0,
//           fieldOfficers: data.totalFieldOfficers || 0,
//           pendingOps: data.pendingOperations || 0,
//           pendingPayments: data.pendingBills || 0,
//         });

//         // arrays (keys your backend currently returns: recentRequests & recentPayments)
//         setRequests(data.recentRequests || []);
//         setPayments(data.recentPayments || []);

//         console.log("received recentRequests:", data.recentPayments);
//       } catch (err) {
//         console.error(
//           "Error fetching dashboard:",
//           err.response?.data || err.message
//         );
//       }
//     };

//     fetchDashboard();
//   }, []);

//   // Map requests (raw tasks) to the shape expected by RequestDataGrid
//   const mappedRequests = (requests || []).map((req, idx) => ({
//     id: req._id ?? idx, // DataGrid needs an `id` field

//     // Prefer populated nested values, otherwise fall back to raw IDs
//     landId: req.processID?.landID || "",
//       // possible populated shapes: req.processID.landId or req.processID.landID
//       // req.processID?.landId ??

//     // possible populated shapes: req.assignedTo.name or req.assignedTo.fullName
//     officer:
//       req.assignedTo?.name ?? req.assignedTo?.fullName ?? req.assignedTo ?? "-",

//     operation: req.name ?? "-", // task name
//     date: req.startDate ? new Date(req.startDate).toLocaleDateString() : "-",
//   }));

//   // If PaymentDataGrid expects a specific shape, map payments similarly.
//   // For now we'll provide simple mapping so the table has ids:
//   const mappedPayments = (payments || []).map((p, idx) => ({
//     // add fields PaymentDataGrid expects; example placeholders:

//     amount:req.total_amount ?? "-"
//     // keep raw object if component wants to access it
//   }));

//   return (
//     <Box sx={{ mb: 4 }}>
//       {/* Breadcrumbs */}
//       <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>
//               {/* Greeting Card */}
//               <Paper
//                 sx={{
//                   mx: "auto",
//                   p: 3,
//                   mb: 3,
//                   borderRadius: 4,
//                   background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
//                 }}
//                 elevation={0}
//               >
//                 <Typography variant="h5" gutterBottom>
//                   Hello {userName} 👋
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Welcome back to the Agricultural Land Preparation System Dashboard.
//                 </Typography>
//               </Paper>
//               <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", pl: 2 }}>
//                 <Typography color="text.primary">
//                   <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
//                   Home
//                 </Typography>
//               </Breadcrumbs>
//             </Box>

//       {/* Division Overview Card */}
//       <Paper
//         elevation={5}
//         sx={{
//           maxWidth: 925,
//           mx: "auto",
//           p: 3,
//           borderRadius: 5,
//           mb: 3,
//           backgroundColor: "#fdfdfd",
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Division Overview
//         </Typography>

//         <Grid container spacing={2} justifyContent="center" alignItems="center">
//           {[
//             { label: "Total registered lands", value: overview.totalLands },
//             { label: "Assigned field officers", value: overview.fieldOfficers },
//             { label: "Pending operations", value: overview.pendingOps },
//             { label: "Pending payments", value: overview.pendingPayments },
//           ].map((item, idx) => (
//             <Grid
//               item
//               key={idx}
//               xs="auto"
//               sx={{ display: "flex", justifyContent: "center" }}
//             >
//               <Card
//                 elevation={2}
//                 sx={{
//                   borderRadius: 4,
//                   bgcolor: "#fff",
//                   boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
//                   textAlign: "center",
//                   minWidth: 140,
//                   px: 2,
//                 }}
//               >
//                 <CardContent sx={{ py: 2 }}>
//                   <Typography
//                     variant="h4"
//                     sx={{ fontWeight: 700, lineHeight: 1 }}
//                   >
//                     {item.value}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ mt: 1 }}
//                   >
//                     {item.label}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Paper>

//       {/* Recent Requests and Payments */}
//       <Box sx={{ maxWidth: 1000, mx: "auto", p: 0 }}>
//         <Grid container spacing={3} justifyContent="space-between" width="97%">
//           <Grid
//             item
//             xs="12"
//             md="6"
//             sx={{ display: "flex", justifyContent: "center" }}
//           >
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 2,
//                 borderRadius: 3,
//                 border: "1px solid #eee",
//                 minWidth: 420,
//                 width: { xs: "100%", md: "auto" },
//                 display: "flex",
//                 flexDirection: "column",
//                 mx: "auto",
//               }}
//             >
//               <Typography
//                 variant="subtitle1"
//                 gutterBottom
//                 sx={{ fontSize: "1rem" }}
//               >
//                 Recent Requests
//               </Typography>
//               <div style={{ width: "100%" }}>
//                 {/* pass the mapped rows to RequestDataGrid */}
//                 <RequestsDataGrid requests={mappedRequests} />
//               </div>
//             </Paper>
//           </Grid>

//           <Grid
//             item
//             xs="12"
//             md="6"
//             sx={{ display: "flex", justifyContent: "center" }}
//           >
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 2,
//                 borderRadius: 3,
//                 border: "1px solid #eee",
//                 minWidth: 420,
//                 width: { xs: "100%", md: "auto" },
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <Typography
//                 variant="subtitle1"
//                 gutterBottom
//                 sx={{ fontSize: "1rem" }}
//               >
//                 Recent Payments
//               </Typography>
//               <div style={{ width: "100%" }}>
//                 {/* adapt PaymentDataGrid props as required by that component */}
//                 <PaymentDataGrid payments={mappedPayments} />
//               </div>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// }


// src/pages/manager/Dashboard.jsx
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
import { getManagerDashboardCardInfo } from "../../api/manager";
import RequestsDataGrid from "../../components/manager/RequestDataGrid";
import PaymentDataGrid from "../../components/manager/PaymentDataGrid";
import { getUserById } from "../../api/user";

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
        if (!userRes || !userRes.data) {
          console.warn("No user data returned");
          return;
        }

        const user = userRes.data;
        setUserName(user.fullName || "");
        setRole(user.role?.name || "");

        // support user.division as object or id
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

        setOverview({
          totalLands: data.totalLands || 0,
          fieldOfficers: data.totalFieldOfficers || 0,
          pendingOps: data.pendingOperations || 0,
          pendingPayments: data.pendingBills || 0,
        });

        setRequests(data.recentRequests || []);
        setPayments(data.recentPayments || []);

        console.log("received recentRequests:", data.recentRequests);
        console.log("received recentPayments:", data.recentPayments);
      } catch (err) {
        console.error("Error fetching dashboard:", err.response?.data || err.message);
      }
    };

    fetchDashboard();
  }, []);

  const mappedRequests = (requests || []).map((req, idx) => {
    const landObj = req.processID?.landID ?? req.processID?.landId ?? null;
    const landId = (landObj && (landObj._id ?? landObj)) ?? "";

    const assigned = req.assignedTo ?? {};
    const officer =
      assigned.name ?? assigned.fullName ?? (typeof assigned === "string" ? assigned : "-");

    return {
      id: req._id ?? idx,
      landId,
      officer,
      operation: req.name ?? "-",
      date: req.startDate ? new Date(req.startDate).toLocaleDateString() : "-",
      raw: req,
    };
  });

  const mappedPayments = (payments || []).map((p, idx) => ({
    id: p._id ?? idx,
    amount: p.total_amount ?? p.amount ?? "-",
    status: p.status ?? "-",
    payer: p.payer?.fullName ?? p.payer?.name ?? (typeof p.payer === "string" ? p.payer : "-"),
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
