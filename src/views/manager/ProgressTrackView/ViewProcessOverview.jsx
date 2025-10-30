// src/components/Process/ViewProcessOverview.jsx
import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import TaskTable from "./ViewTaskTable/ViewTaskTable.jsx";
import BillDetailDialog from "./BillDetailDialog.jsx"; // adjust path if different
import { useGetBillByProcess } from "../../../hooks/bill.hook";

const ViewProcessOverview = ({ process }) => {
  const displayedTasks = useMemo(() => process?.tasks ?? [], [process]);

  // Bill fetching state
  const { data: billFromServer, isLoading: loadingBill, refetch: refetchBill } = useGetBillByProcess(
    process?._id,
    { enabled: !!process?._id }
  );

  const [currentBill, setCurrentBill] = useState(null);
  const [openBillPreview, setOpenBillPreview] = useState(false);

  // pick approved bill or latest
  useEffect(() => {
    if (!billFromServer) {
      setCurrentBill(null);
      return;
    }
    const billsArray = Array.isArray(billFromServer) ? billFromServer : [billFromServer];
    const approved = billsArray.find(b => String(b?.status ?? "").toLowerCase() === "approved");
    const pick =
      approved ||
      billsArray.slice().sort((a, b) => {
        const aTime = new Date(a?.createdAt ?? 0).getTime();
        const bTime = new Date(b?.createdAt ?? 0).getTime();
        return bTime - aTime;
      })[0] ||
      null;
    setCurrentBill(pick);
  }, [billFromServer]);

  const showApprovedBill =
    !!currentBill && String(currentBill?.status ?? "").toLowerCase() === "approved";

  return (
    <>
      <Paper elevation={3} sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 3, mt: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mx: 3, my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Start Date: {process?.startedDate ?? "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            End Date: {process?.endDate ?? "-"}
          </Typography>
          <Typography variant="body2" color="green" fontWeight="bold">
            STATUS: {process?.status ?? "-"}
          </Typography>
        </Box>

        <Stack spacing={1}>
          {displayedTasks.length === 0 ? (
            <Typography color="text.secondary" sx={{ px: 5 }}>
              No tasks for this process yet.
            </Typography>
          ) : (
            displayedTasks.map((task, idx) => (
              <TaskTable key={task._id ?? task.id ?? idx} task={task} />
            ))
          )}
        </Stack>

        {/* Bill preview button (only when an approved/latest bill exists) */}
        {showApprovedBill && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpenBillPreview(true)}
              startIcon={<VisibilityIcon />}
            >
              View Approved Bill
            </Button>
          </Box>
        )}
      </Paper>

      {/* Bill detail dialog (re-uses your BillDetailDialog) */}
      <BillDetailDialog
        open={openBillPreview}
        onClose={() => setOpenBillPreview(false)}
        bill={currentBill}
      />
    </>
  );
};

ViewProcessOverview.propTypes = {
  process: PropTypes.shape({
    _id: PropTypes.string,
    startedDate: PropTypes.string,
    endDate: PropTypes.string,
    status: PropTypes.string,
    tasks: PropTypes.array,
  }).isRequired,
};

export default ViewProcessOverview;
