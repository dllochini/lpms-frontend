import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import OperationTable from "./OperationTable";
import ConfirmDialog from "./ConfirmDialog";
import FlagIssueDialog from "./FlagIssueDialog";
import { useUpdateBillById } from "../../../../hooks/bill.hook";
import { useUpdateProcessById } from "../../../../hooks/process.hook";

const PaymentApprovalDialog = ({ selectedPayment, expandedOps, toggleOp, onClose }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openFlagDialog, setOpenFlagDialog] = useState(false);
  const [approvalFeedback, setApprovalFeedback] = useState("");
  const [flagText, setFlagText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { mutateAsync: updateBill } = useUpdateBillById();
  const { mutateAsync: updateProcess } = useUpdateProcessById();

  const currency = (val) =>
    Number(val || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (!selectedPayment) return null;

  const requestedDate = selectedPayment.process?.endDate
    ? new Date(selectedPayment.process.endDate).toLocaleDateString()
    : "N/A";

  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError("");

      // console.log(selectedPayment._id,"bill")
      await updateBill({
        billId: selectedPayment._id, // 👈 changed key
        updatedData: { status: "Approved", notes: approvalFeedback },
      });

      // console.log(selectedPayment.process?._id,"process")
      if (selectedPayment.process?._id) {
        await updateProcess({
          processId: selectedPayment.process._id,
          updatedData: { status: "Approved" },
        });
      }

      // console.log("Bill and Process approved successfully");
      setOpenConfirm(false);
      onClose();
    } catch (err) {
      console.error("Error approving bill:", err);
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFlagIssue = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError("");

      await updateBill({
        billId: selectedPayment._id,
        data: { status: "Flagged", notes: flagText },
      });

      if (selectedPayment.process?._id) {
        await updateProcess({
          id: selectedPayment.process._id,
          data: { status: "Flagged" },
        });
      }

      // console.log("Bill flagged successfully");
      setOpenFlagDialog(false);
      onClose();
    } catch (err) {
      console.error("Error flagging bill:", err);
      setSubmitError(err.message || "Something went wrong while flagging.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <Dialog open={!!selectedPayment} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Payment Approval</DialogTitle>

        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Bill ID:</strong> {selectedPayment._id ?? "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Land:</strong> {selectedPayment.process?.land?.address ?? "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Field Officer:</strong>{" "}
              {selectedPayment.process?.land?.createdBy?.fullName ?? "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Requested Date:</strong> {requestedDate}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <OperationTable
            operations={selectedPayment.taskSubTotals || []}
            workdone={selectedPayment.workdoneSubTotals || []}
            expandedOps={expandedOps}
            toggleOp={toggleOp}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3, mt: 2 }}>
            <Typography variant="subtitle2">
              <strong>Total Amount (LKR): {currency(selectedPayment.totalAmount)}</strong>
            </Typography>
          </Box>
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ gap: 1, px: 3, py: 2 }}>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => {
              setSubmitError("");
              setOpenFlagDialog(true);
            }}
            disabled={isSubmitting}
          >
            Flag Issue
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setSubmitError("");
              setOpenConfirm(true);
            }}
            disabled={isSubmitting}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirm Approval"
        loading={isSubmitting}
        error={submitError}
        feedback={approvalFeedback}
        setFeedback={setApprovalFeedback}
      />

      {/* Flag Issue Dialog */}
      <FlagIssueDialog
        open={openFlagDialog}
        onClose={() => setOpenFlagDialog(false)}
        onSubmit={handleFlagIssue}
        loading={isSubmitting}
        error={submitError}
        flagText={flagText}
        setFlagText={setFlagText}
      />
    </>
  );
};

export default PaymentApprovalDialog;
