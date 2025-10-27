import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Paper, Stack, Typography } from "@mui/material";

import TaskTable from "./ViewTaskTable/ViewTaskTable.jsx";

const ProcessOverview = ({ process }) => {
  const displayedTasks = useMemo(() => process?.tasks ?? [], [process]);

  return (
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
    </Paper>
  );
};

ProcessOverview.propTypes = {
  process: PropTypes.shape({
    _id: PropTypes.string,
    startedDate: PropTypes.string,
    endDate: PropTypes.string,
    status: PropTypes.string,
    tasks: PropTypes.array,
  }).isRequired,
};

export default ProcessOverview;
