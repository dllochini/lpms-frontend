
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Collapse,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link as RouterLink } from "react-router-dom";
import PendingPaymentDataGrid from "../../components/higherManager/PaymentApprovalGrid";
import { set, useForm } from "react-hook-form";
import { useGetTasksByDiv } from "../../hooks/task.hooks";

export default function PaymentApproval({initialData,initialTask}) {
  const [rows, setRows] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [expandedOps, setExpandedOps] = useState({}); // { opIndex: true }
  const [selectedTask, setSelectedTask] = useState(null);
  useEffect(() => {
    const wds = initialTask?.workDones ?? [];
    const rows = Array.isArray(wds)
      ? wds.map((wd, index) => ({
          id: wd._id ?? `${initialTask?._id ?? "t"}-${index}`,
          date: wd.startDate ? new Date(wd.startDate).toLocaleDateString() : "N/A",
          progress: wd.newWork ?? "N/A",
          note: wd.notes ?? wd.note ?? "—",
        }))
      : [];
    setTaskRows(rows);
  }, [initialTask]);

  if(!initialData) return null;

  // useEffect(() => {
  //   // sample rows - replace with API fetch as needed
  //   setRows([
  //     {
  //       id: "B1234",
  //       billId: "B1234",
  //       landId: "L1234",
  //       fieldOfficer: "Alex Jones",
  //       accountant: "Alex Jones",
  //       requestedDate: "2025-08-12",
  //       operations: [
  //         {
  //           date: "04/17/2022",
  //           operation: "Bush Clearing",
  //           subtotal: 10000,
  //           details: []
  //         },
  //         {
  //           date: "04/17/2022",
  //           operation: "Ploughing",
  //           subtotal: 10000,
  //           details: [
  //             { date: "04/17/2022", method: "Tractor 4WD", unitPrice: 200, subtotal: 4000 },
  //             { date: "04/17/2022", method: "Tractor 4WD", unitPrice: 100, subtotal: 3000 }
  //           ]
  //         },
  //         {
  //           date: "04/18/2022",
  //           operation: "Fertilizing",
  //           subtotal: 15000,
  //           details: [
  //             { date: "04/18/2022", method: "Manual Spray", unitPrice: 500, subtotal: 15000 }
  //           ]
  //         }
  //       ],
  //       discount: 4000,
  //       total: 100000
  //     },
  //     {
  //       id: "B1235",
  //       billId: "B1235",
  //       landId: "L1235",
  //       fieldOfficer: "Chris Smith",
  //       accountant: "John Doe",
  //       requestedDate: "2025-08-13",
  //       operations: [],
  //       discount: 0,
  //       total: 0
  //     }
  //   ]);
  //  }, []);
  const{control}=useForm();

  const {data: tasksData = [], isLoading} = useGetTasksByDiv(localStorage.getItem("loggedUserId"), {
      onSuccess: (data) => {
        console.log("Lands for field officer:", data);
      },
      onError: (error) => {
        console.error("Failed to fetch lands for field officer", error);
      },
    });

    const tasks = useMemo(() => Array.isArray(tasksData) ? tasksData : [], [tasksData]);
      // console.log(tasks,"response")


  // called when grid "VIEW DETAILS" clicked
  const handleViewDetails = (row) => {
    const rowId = row._id ?? row.id;

    // find the matching task in tasks (tasks is from your hook)
    const matchedtask = tasks.find(
      (t) => String(t._id) === String(row.id) || String(t.id) === String(row.id)
    ) ?? null;  

    console.log("Cliked row:", row, "matchedtask", matchedtask);
    // console.log("Parent received onViewDetails row:", row);
    // setSelectedPayment(row);
    // setExpandedOps({}); // reset expansions for new dialog

    setRows(row); 
    setExpandedOps({}); // reset expansions for new dialog
    setSelectedTask(matchedtask); // NEW (matching task or null)

  };

  const toggleOp = (index) => {
    setExpandedOps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const currency = (val) =>
    Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>

      <Typography variant="h5" gutterBottom>Pending Payment Approval</Typography>
      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }}>
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} /> Home
        </Link>
        <Typography color="text.primary">Payments Approval</Typography>
      </Breadcrumbs>

      <Paper elevation={5} sx={{ p: 3, borderRadius: 3 }}>
        {/* PASS the handler so the VIEW button opens the dialog */}
        <PendingPaymentDataGrid rows={rows} onViewDetails={handleViewDetails} />
      </Paper>

      {/* Dialog: opens when selectedPayment is set */}
      <Dialog open={!!selectedPayment} onClose={() => setSelectedPayment(null)} maxWidth="md" fullWidth>
        {selectedPayment && (
          <>
            <DialogTitle>Payment Approval</DialogTitle>

            <DialogContent dividers>
              {/* Header info */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2"><strong>Bill ID :</strong> {initialTask?.operation?.bill ?? "N/A"}</Typography>
                <Typography variant="body2"><strong>Land ID :</strong> {initialTask?.process?.land?.address ?? "N/A"}</Typography>
                <Typography variant="body2"><strong>Field Officer :</strong> {initialTask?.assignedTo?.fullName ?? "N/A"}</Typography>
                <Typography variant="body2"><strong>Accountant :</strong> {selectedPayment.accountant}</Typography>
                <Typography variant="body2"><strong>Requested Date :</strong> {selectedPayment.requestedDate}</Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Operations table with collapsible details */}
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell /> {/* expand icon column */}
                      <TableCell>Date</TableCell>
                      <TableCell>Operation</TableCell>
                      <TableCell align="right">Sub total (LKR)</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {selectedPayment.operations?.length ? (
                      selectedPayment.operations.map((op, idx) => (
                        <React.Fragment key={idx}>
                          <TableRow hover>
                            <TableCell width={48} sx={{ p: 0 }}>
                              <IconButton
                                size="small"
                                onClick={() => toggleOp(idx)}
                                aria-label={expandedOps[idx] ? "collapse" : "expand"}
                              >
                                {expandedOps[idx] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            </TableCell>

                            <TableCell>{op.date}</TableCell>
                            <TableCell>{op.operation}</TableCell>
                            <TableCell align="right">{currency(op.subtotal)}</TableCell>
                          </TableRow>

                          {/* Collapsed details */}
                          <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                              <Collapse in={!!expandedOps[idx]} timeout="auto" unmountOnExit>
                                <Box sx={{ margin: 1 }}>
                                  <Table size="small" aria-label="details">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Method of Work</TableCell>
                                        <TableCell align="right">Unit Price (LKR)</TableCell>
                                        <TableCell align="right">Sub total (LKR)</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {op.details?.length ? (
                                        op.details.map((d, i) => (
                                          <TableRow key={i}>
                                            <TableCell>{d.date ?? op.date}</TableCell>
                                            <TableCell>{d.method}</TableCell>
                                            <TableCell align="right">{currency(d.unitPrice)}</TableCell>
                                            <TableCell align="right">{currency(d.subtotal)}</TableCell>
                                          </TableRow>
                                        ))
                                      ) : (
                                        <TableRow>
                                          <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                                            No detail rows
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                          No operations available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Discount and Total aligned to right */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 3 }}>
                <Box sx={{ minWidth: 220 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", px: 1 }}>
                    <Typography variant="body2">Discount :</Typography>
                    <Typography variant="body2">{currency(selectedPayment.discount || 0)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", px: 1, mt: 0.5 }}>
                    <Typography variant="subtitle2"><strong>Total Amount (LKR) :</strong></Typography>
                    <Typography variant="subtitle2"><strong>{currency(selectedPayment.total || 0)}</strong></Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  // TODO: call reject endpoint then close / refresh rows
                  setSelectedPayment(null);
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  // TODO: call accept endpoint then close / refresh rows
                  setSelectedPayment(null);
                }}
              >
                Accept
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}


