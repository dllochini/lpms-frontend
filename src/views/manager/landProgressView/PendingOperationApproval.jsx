

// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Box,
//   Paper,
//   Breadcrumbs,
//   Link,
//   Button,
//   Stack,
// } from "@mui/material";
// import HomeIcon from "@mui/icons-material/Home";
// import { DataGrid } from "@mui/x-data-grid";
// import { Link as RouterLink, useNavigate } from "react-router-dom";

// export default function PendingOperationalApproval() {
//   const [rows, setRows] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setRows([
//       {
//         id: "L1234",
//         landId: "L1234",
//         fieldOfficer: "Alex Jones",
//         area: 5,
//         currentStatus: "Ploughing",
//         currentStatusProgress: "60%",
//         overallProgress: "35%",
//       },
//       {
//         id: "L1235",
//         landId: "L1235",
//         fieldOfficer: "Chris Smith",
//         area: 10,
//         currentStatus: "Seeding",
//         currentStatusProgress: "40%",
//         overallProgress: "20%",
//       },
//     ]);
//   }, []);

//   const handleViewDetails = (landId) => {
//     // Navigate to ManagerProgressTrack with landId
//     navigate(`/manager/landProgressView/ManagerProgressTrack/${landId}`);
//   };

//   const columns = [
//     { field: "landId", headerName: "Land ID", width: 150, headerAlign: "center", align: "center" },
//     { field: "fieldOfficer", headerName: "Field Officer", width: 150, headerAlign: "center", align: "center" },
//     { field: "area", headerName: "Area (Acre)", width: 150, headerAlign: "center", align: "center" },
//     { field: "currentStatus", headerName: "Current Status", width: 150, headerAlign: "center", align: "center" },
//     {
//       field: "currentStatusProgress",
//       headerName: "Current Status Progress",
//       width: 200,
//       headerAlign: "center",
//       align: "center",
//     },
//     {
//       field: "overallProgress",
//       headerName: "Overall Progress",
//       width: 180,
//       headerAlign: "center",
//       align: "center",
//     },
//     {
//       field: "actions",
//       headerName: "Action",
//       width: 160,
//       headerAlign: "center",
//       align: "center",
//       renderCell: (params) => (
//         <Button
//           size="small"
//           variant="contained"
//           color="primary"
//           onClick={() => handleViewDetails(params.row.landId)}
//         >
//           View Details
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
//       {/* Top Navigation Buttons */}
//       <Stack
//         direction="row"
//         spacing={2}
//         justifyContent="center"
//         alignItems="center"
//         sx={{ mb: 2 }}
//       >
//         <Button variant="outlined" component={RouterLink} to="/">
//           Home
//         </Button>
//         <Button variant="outlined" component={RouterLink} to="/operations">
//           Operations Approval
//         </Button>
//         <Button variant="outlined" component={RouterLink} to="/payments">
//           Payments Approval
//         </Button>
//         <Button
//           variant="contained"
//           color="primary"
//           component={RouterLink}
//           to="/land-progress"
//         >
//           Land Progress
//         </Button>
//       </Stack>

//       <Typography variant="h5" gutterBottom>
//         Land Progress 
//       </Typography>

//       <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", mb: 2 }}>
//         <Link
//           component={RouterLink}
//           to="/"
//           underline="hover"
//           color="inherit"
//           sx={{ display: "flex", alignItems: "center" }}
//         >
//           <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} /> Home
//         </Link>
//         <Typography color="text.primary">Land Progress </Typography>
//       </Breadcrumbs>

//       <Paper elevation={5} sx={{ p: 2, borderRadius: 3 }}>
//         <div style={{ height: 400, width: "100%" }}>
//           <DataGrid
//             rows={rows}
//             columns={columns}
//             disableRowSelectionOnClick
//             hideFooterSelectedRowCount
//             pageSizeOptions={[5, 10]}
//             initialState={{
//               pagination: { paginationModel: { pageSize: 5 } },
//             }}
//           />
//         </div>
//       </Paper>
//     </Box>
//   );
// }
