import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Button,
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
  CircularProgress,
  Alert,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link as RouterLink } from "react-router-dom";
import PendingPaymentDataGrid from "../../components/higherManager/PaymentApprovalGrid";
import axios from "axios";

export default function PaymentApproval() {
  const [userDivision, setUserDivision] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [expandedOps, setExpandedOps] = useState({});

  // Fetch user's division
  useEffect(() => {
    const fetchDivision = async () => {
      const loggedUserId = localStorage.getItem("loggedUserId") || "";
      if (!loggedUserId) {
        setError("User not logged in");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3000/api/users/${loggedUserId}`);
        const divisionId = res.data.division?._id || "";
        setUserDivision(divisionId);
      } catch (err) {
        console.error("Failed to fetch user division:", err);
        setError("Failed to load user division");
      }
    };
    fetchDivision();
  }, []);

  // Fetch pending payments
  useEffect(() => {
    const fetchPayments = async () => {
      if (!userDivision) return;

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `http://localhost:3000/api/paymentApproval/division/${userDivision}`
        );
        
        console.log("Fetched payments:", res.data);
        setPayments(res.data.data || res.data || []);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setError(err.response?.data?.message || "Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [userDivision]);

  // Approve payment
  const handleApprove = async (billId) => {
    try {
      await axios.put(`http://localhost:3000/api/paymentApproval/bill/${billId}/approve`);
      setSelectedPayment(null);
      
      // Refresh list
      const res = await axios.get(
        `http://localhost:3000/api/paymentApproval/division/${userDivision}`
      );
      setPayments(res.data.data || res.data || []);
    } catch (err) {
      console.error("Approve failed:", err);
      setError(err.response?.data?.message || "Failed to approve payment");
    }
  };

  // Reject payment
  const handleReject = async (billId) => {
    try {
      await axios.put(`http://localhost:5000/api/paymentApproval/bill/${billId}/reject`, {
        reason: "Rejected by higher manager"
      });
      setSelectedPayment(null);
      
      // Refresh list
      const res = await axios.get(
        `http://localhost:5000/api/paymentApproval/division/${userDivision}`
      );
      setPayments(res.data.data || res.data || []);
    } catch (err) {
      console.error("Reject failed:", err);
      setError(err.response?.data?.message || "Failed to reject payment");
    }
  };

  // View details handler
  const handleViewDetails = (row) => {
    console.log("Viewing details for:", row);
    setSelectedPayment(row);
    setExpandedOps({});
  };

  // Map backend data to frontend structure
  const mappedPayments = (payments || []).map((bill, idx) => {
    const process = bill.processID || bill.process || {};
    const land = process.landId || process.land || {};
    const createdBy = bill.createdBy || {};
    
    return {
      id: bill._id || idx,
      billId: bill._id || "-",
      landId: land._id || land.landName || "-",
      requestedDate: bill.createdAt
        ? new Date(bill.createdAt).toLocaleDateString()
        : "-",
      fieldOfficer: createdBy.fullName || createdBy.name || "N/A",
      total: bill.totalAmount || 0,
      discount: 0, // Add if you have discount field
      operations: [], // Map from your tasks/workdone if available
      // Keep raw bill data for dialog
      _rawBill: bill,
    };
  });

  const toggleOp = (index) => {
    setExpandedOps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const currency = (val) =>
    Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Pending Payment Approval
      </Typography>
      
      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", mb: 2 }}>
        <Link
          component={RouterLink}
          to="/higherManager"
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} /> Home
        </Link>
        <Typography color="text.primary">Payments Approval</Typography>
      </Breadcrumbs>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={5} sx={{ p: 3, borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <PendingPaymentDataGrid
            rows={mappedPayments}
            onViewDetails={handleViewDetails}
          />
        )}
      </Paper>

      {/* Payment Details Dialog */}
      <Dialog
        open={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedPayment && (
          <>
            <DialogTitle>Payment Approval</DialogTitle>

            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Bill ID:</strong> {selectedPayment.billId}
                </Typography>
                <Typography variant="body2">
                  <strong>Land ID:</strong> {selectedPayment.landId}
                </Typography>
                <Typography variant="body2">
                  <strong>Field Officer:</strong> {selectedPayment.fieldOfficer}
                </Typography>
                <Typography variant="body2">
                  <strong>Requested Date:</strong> {selectedPayment.requestedDate}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Operations table */}
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell />
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
                              >
                                {expandedOps[idx] ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell>{op.date}</TableCell>
                            <TableCell>{op.operation}</TableCell>
                            <TableCell align="right">
                              {currency(op.subtotal)}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell
                              style={{ paddingBottom: 0, paddingTop: 0 }}
                              colSpan={4}
                            >
                              <Collapse in={!!expandedOps[idx]} timeout="auto" unmountOnExit>
                                <Box sx={{ margin: 1 }}>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Method of Work</TableCell>
                                        <TableCell align="right">
                                          Unit Price (LKR)
                                        </TableCell>
                                        <TableCell align="right">
                                          Sub total (LKR)
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {op.details?.map((d, i) => (
                                        <TableRow key={i}>
                                          <TableCell>{d.date ?? op.date}</TableCell>
                                          <TableCell>{d.method}</TableCell>
                                          <TableCell align="right">
                                            {currency(d.unitPrice)}
                                          </TableCell>
                                          <TableCell align="right">
                                            {currency(d.subtotal)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
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

              {/* Totals */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                <Box sx={{ minWidth: 220 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", px: 1 }}>
                    <Typography variant="body2">Discount:</Typography>
                    <Typography variant="body2">
                      {currency(selectedPayment.discount || 0)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      px: 1,
                      mt: 0.5,
                    }}
                  >
                    <Typography variant="subtitle2">
                      <strong>Total Amount (LKR):</strong>
                    </Typography>
                    <Typography variant="subtitle2">
                      <strong>{currency(selectedPayment.total || 0)}</strong>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleReject(selectedPayment.billId)}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleApprove(selectedPayment.billId)}
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