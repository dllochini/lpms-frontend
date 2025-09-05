
// import {
//     Typography,
//     Box,
//     Paper,
//     Breadcrumbs,
//     Grid,
//     Card,
//     CardContent,
//     Button,
//     Stack,
//   } from "@mui/material";
//   import HomeIcon from "@mui/icons-material/Home";
//   import { useEffect, useState } from "react";
  
//   export default function ManagerDashboard() {
//     const [overview, setOverview] = useState({
//       totalLands: 250,
//       fieldOfficers: 10,
//       pendingOps: 5,
//       pendingPayments: 3,
//     });
  
//     const [requests, setRequests] = useState([
//       {
//         landId: "L1313",
//         officer: "Alex Jones",
//         operation: "Bush Clearing",
//         date: "11th Aug 2025",
//       },
//       {
//         landId: "L1313",
//         officer: "Alex Jones",
//         operation: "Bush Clearing",
//         date: "11th Aug 2025",
//       },
//     ]);
  
//     const [payments, setPayments] = useState([
//       {
//         billId: "L1313",
//         officer: "Alex Jones",
//         accountant: "Alex Jones",
//         date: "11th Aug 2025",
//       },
//       {
//         billId: "L1313",
//         officer: "Alex Jones",
//         accountant: "Alex Jones",
//         date: "11th Aug 2025",
//       },
//     ]);
  
//     useEffect(() => {
//       // Fetch real data here if API is ready
//     }, []);
  
//     return (
//       <Box sx={{ mb: 2 }}>
//         {/* Top Navigation Buttons */}
//         <Box sx={{ maxWidth: 1100, mx: "auto", p: 2 }}>
//         <Stack
//             direction="row"
//             spacing={2}
//             justifyContent="center"   // ✅ Centers the buttons horizontally
//         >
//             <Button variant="contained" color="primary" size="small">
//               Home
//             </Button>
//             <Button variant="outlined" size="small">
//               Operations Approval
//             </Button>
//             <Button variant="outlined" size="small">
//               Payments Approval
//             </Button>
//             <Button variant="outlined" size="small">
//               Land Progress
//             </Button>
//           </Stack>
//         </Box>
  
//         {/* Greeting & Breadcrumb */}
//         <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
//           <Typography variant="h5" gutterBottom>
//             Hello Manager!
//           </Typography>
  
//           <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
//             <Typography color="text.primary">
//               <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
//               Home
//             </Typography>
//           </Breadcrumbs>
//         </Box>
  
//         {/* Division Overview */}
//         <Paper
//           elevation={5}
//           sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5, mb: 3 }}
//         >
//           <Typography variant="h6" gutterBottom>
//             Division Overview
//           </Typography>
//           <Grid container spacing={2}>
//             {[
//               { label: "Total registered lands", value: overview.totalLands },
//               { label: "Assigned field officers", value: overview.fieldOfficers },
//               { label: "Pending operations", value: overview.pendingOps },
//               { label: "Pending payments", value: overview.pendingPayments },
//             ].map((item, idx) => (
//               <Grid item xs={12} sm={6} md={3} key={idx}>
//                 <Card elevation={3} sx={{ borderRadius: 3 }}>
//                   <CardContent sx={{ textAlign: "center" }}>
//                     <Typography variant="h5">{item.value}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {item.label}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Paper>
  
//         {/* Recent Requests & Payments */}
//         <Grid container spacing={3} sx={{ maxWidth: 1100, mx: "auto" }}>
//           <Grid item xs={12} md={6}>
//             <Paper elevation={5} sx={{ p: 3, borderRadius: 5 }}>
//               <Typography variant="h6" gutterBottom>
//                 Recent requests
//               </Typography>
//               <table width="100%">
//                 <thead>
//                   <tr>
//                     <th align="left">Land ID</th>
//                     <th align="left">Field Officer</th>
//                     <th align="left">Operation</th>
//                     <th align="left">Requested Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {requests.map((req, i) => (
//                     <tr key={i}>
//                       <td>{req.landId}</td>
//                       <td>{req.officer}</td>
//                       <td>{req.operation}</td>
//                       <td>{req.date}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </Paper>
//           </Grid>
  
//           <Grid item xs={12} md={6}>
//             <Paper elevation={5} sx={{ p: 3, borderRadius: 5 }}>
//               <Typography variant="h6" gutterBottom>
//                 Recent payments
//               </Typography>
//               <table width="100%">
//                 <thead>
//                   <tr>
//                     <th align="left">Bill ID</th>
//                     <th align="left">Field Officer</th>
//                     <th align="left">Accountant</th>
//                     <th align="left">Requested Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {payments.map((pay, i) => (
//                     <tr key={i}>
//                       <td>{pay.billId}</td>
//                       <td>{pay.officer}</td>
//                       <td>{pay.accountant}</td>
//                       <td>{pay.date}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Box>
//     );
//   }
  

// ManagerDashboard.jsx
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
      totalLands: 250,
      fieldOfficers: 10,
      pendingOps: 5,
      pendingPayments: 3,
    });
  
    const [requests, setRequests] = useState([
      { landId: "L1313", officer: "Alex Jones", operation: "Bush Clearing", date: "11th Aug 2025" },
      { landId: "L1314", officer: "Mary Smith", operation: "Tree Planting", date: "12th Aug 2025" },
    ]);
  
    const [payments, setPayments] = useState([
      { billId: "B1313", officer: "Alex Jones", accountant: "John Doe", date: "11th Aug 2025" },
      { billId: "B1314", officer: "Mary Smith", accountant: "Jane Roe", date: "12th Aug 2025" },
    ]);
  
    useEffect(() => {
      // fetch real data if needed
    }, []);
  
    // Remove request by row (object)
    const handleDeleteRequest = (row) => {
      setRequests((prev) => prev.filter((r) => r.landId !== row.landId));
    };
  
    // Remove payment by row (object)
    const handleDeletePayment = (row) => {
      setPayments((prev) => prev.filter((p) => p.billId !== row.billId));
    };
  
    const handleEditRequest = (row) => {
      console.log("Edit request", row);
      // navigate to edit page or open edit dialog
    };
  
    const handleEditPayment = (row) => {
      console.log("Edit payment", row);
      // navigate to edit page or open edit dialog
    };
  
    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", p: 2 }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" color="primary" size="small">Home</Button>
            <Button variant="outlined" size="small">Operations Approval</Button>
            <Button variant="outlined" size="small">Payments Approval</Button>
            <Button variant="outlined" size="small">Land Progress</Button>
          </Stack>
        </Box>
  
        <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
          <Typography variant="h5" gutterBottom>Hello Manager!</Typography>
          <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
            <Typography color="text.primary">
              <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
              Home
            </Typography>
          </Breadcrumbs>
        </Box>
  
        <Paper elevation={5} sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Division Overview</Typography>
          <Grid container spacing={2}>
            {[
              { label: "Total registered lands", value: overview.totalLands },
              { label: "Assigned field officers", value: overview.fieldOfficers },
              { label: "Pending operations", value: overview.pendingOps },
              { label: "Pending payments", value: overview.pendingPayments },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h5">{item.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
  
        <Grid container spacing={3} sx={{ maxWidth: 1100, mx: "auto" }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={5} sx={{ p: 3, borderRadius: 5 }}>
              <Typography variant="h6" gutterBottom>Recent Requests</Typography>
              <RequestsDataGrid
                requests={requests}
                onDelete={handleDeleteRequest}
                onEdit={handleEditRequest}
              />
            </Paper>
          </Grid>
  
          <Grid item xs={12} md={6}>
            <Paper elevation={5} sx={{ p: 3, borderRadius: 5 }}>
              <Typography variant="h6" gutterBottom>Recent Payments</Typography>
              <PaymentDataGrid
                payments={payments}
                onDelete={handleDeletePayment}
                onEdit={handleEditPayment}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }
  