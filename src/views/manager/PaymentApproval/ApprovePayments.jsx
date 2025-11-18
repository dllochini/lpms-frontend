import React, { useState, useMemo } from "react";
import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink } from "react-router-dom";
import PendingPaymentDataGrid from "./PaymentDataGrid";
import { useGetBillsByDiv } from "../../../hooks/bill.hook";
import PaymentApprovalDialog from "./PaymentApprovalDialog/PaymentApprovalDialog";

export default function PaymentApproval() {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [expandedOps, setExpandedOps] = useState({});

  const { data: billData = [], isLoading } = useGetBillsByDiv(localStorage.getItem("loggedUserId"), {
    onSuccess: (data) => console.log("Pending bills:", data),
    onError: (error) => console.error("Failed to fetch pending bills", error),
  });

  const bills = useMemo(() => (Array.isArray(billData) ? billData : []), [billData]);

  const handleViewDetails = (bill) => {
    setExpandedOps({});
    setSelectedPayment(bill);
  };

  const toggleOp = (index) => {
    setExpandedOps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Pending Payment Approval
      </Typography>

      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", mb: 2 }}>
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} /> Home
        </Link>
        <Typography color="text.primary">Payments Approval</Typography>
      </Breadcrumbs>

      <Paper elevation={5} sx={{ p: 3, borderRadius: 3 }}>
        <PendingPaymentDataGrid rows={bills} onViewDetails={handleViewDetails} loading={isLoading} />
      </Paper>

      <PaymentApprovalDialog
        selectedPayment={selectedPayment}
        expandedOps={expandedOps}
        toggleOp={toggleOp}
        onClose={() => setSelectedPayment(null)}
      />
    </Box>
  );
}
