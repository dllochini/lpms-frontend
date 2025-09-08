// pages/manager/PaymentApproval.jsx
// pages/manager/PaymentApprovalDialog.jsx
// pages/manager/PaymentApprovalDialog.jsx
// import React from "react";
// import {
//   Typography,
//   Box,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Button,
// } from "@mui/material";
// import { useState, useEffect } from "react";
// import PendingPaymentDataGrid from "../../components/manager/PendingPaymentDataGrid";

// export default function PaymentApprovalDialog() {
//   const [rows, setRows] = useState([]);
//   const [selectedPayment, setSelectedPayment] = useState(null);

//   useEffect(() => {
//     setRows([
//       {
//         id: "B1234",
//         billId: "B1234",
//         landId: "L1234",
//         fieldOfficer: "Alex Jones",
//         accountant: "Alex Jones",
//         requestedDate: "2025-08-12",
//         operations: [
//           {
//             date: "04/17/2022",
//             operation: "Bush Clearing",
//             subtotal: 10000,
//             details: []
//           },
//           {
//             date: "04/17/2022",
//             operation: "Ploughing",
//             subtotal: 10000,
//             details: [
//               { method: "Tractor 4WD", unitPrice: 200, qty: 20, subtotal: 4000 },
//               { method: "Tractor 4WD", unitPrice: 100, qty: 30, subtotal: 3000 }
//             ]
//           }
//         ],
//         discount: 4000,
//         total: 100000
//       },
//       // add more rows if needed for testing
//     ]);
//   }, []);

//   // debug helper
//   const handleViewDetails = (row) => {
//     console.log("Parent received onViewDetails row:", row);
//     setSelectedPayment(row);
//   };

//   return (
//     <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
//       <Paper elevation={5} sx={{ p: 3, borderRadius: 3 }}>
//         <PendingPaymentDataGrid rows={rows} onViewDetails={handleViewDetails} />
//       </Paper>

//       <Dialog
//         open={!!selectedPayment}
//         onClose={() => setSelectedPayment(null)}
//         maxWidth="md"
//         fullWidth
//       >
//         {selectedPayment && (
//           <>
//             <DialogTitle>Payment Approval</DialogTitle>
//             <DialogContent dividers>
//               <Typography>Bill ID: {selectedPayment.billId}</Typography>
//               <Typography>Land ID: {selectedPayment.landId}</Typography>
//               <Typography>Field Officer: {selectedPayment.fieldOfficer}</Typography>
//               <Typography>Accountant: {selectedPayment.accountant}</Typography>
//               <Typography>Requested Date: {selectedPayment.requestedDate}</Typography>

//               <Box mt={2}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Date</TableCell>
//                       <TableCell>Operation</TableCell>
//                       <TableCell>Subtotal (LKR)</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {selectedPayment.operations.map((op, idx) => (
//                       <React.Fragment key={idx}>
//                         <TableRow>
//                           <TableCell>{op.date}</TableCell>
//                           <TableCell>{op.operation}</TableCell>
//                           <TableCell>{Number(op.subtotal).toLocaleString()}</TableCell>
//                         </TableRow>

//                         {op.details?.length > 0 && (
//                           <TableRow>
//                             <TableCell colSpan={3} sx={{ p: 0 }}>
//                               <Table size="small">
//                                 <TableHead>
//                                   <TableRow>
//                                     <TableCell>Method</TableCell>
//                                     <TableCell>Unit Price</TableCell>
//                                     <TableCell>Qty</TableCell>
//                                     <TableCell>Subtotal</TableCell>
//                                   </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                   {op.details.map((d, i) => (
//                                     <TableRow key={i}>
//                                       <TableCell>{d.method}</TableCell>
//                                       <TableCell>{Number(d.unitPrice).toLocaleString()}</TableCell>
//                                       <TableCell>{Number(d.qty).toLocaleString()}</TableCell>
//                                       <TableCell>{Number(d.subtotal).toLocaleString()}</TableCell>
//                                     </TableRow>
//                                   ))}
//                                 </TableBody>
//                               </Table>
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </Box>

//               <Box mt={2}>
//                 <Typography>Discount: {Number(selectedPayment.discount).toLocaleString()}</Typography>
//                 <Typography variant="h6">Total: {Number(selectedPayment.total).toLocaleString()}</Typography>
//               </Box>
//             </DialogContent>

//             <DialogActions>
//               <Button
//                 variant="contained"
//                 color="error"
//                 onClick={() => {
//                   // TODO: API call to reject
//                   setSelectedPayment(null);
//                 }}
//               >
//                 Reject
//               </Button>
//               <Button
//                 variant="contained"
//                 color="success"
//                 onClick={() => {
//                   // TODO: API call to accept
//                   setSelectedPayment(null);
//                 }}
//               >
//                 Accept
//               </Button>
//             </DialogActions>
//           </>
//         )}
//       </Dialog>
//     </Box>
//   );
// }
