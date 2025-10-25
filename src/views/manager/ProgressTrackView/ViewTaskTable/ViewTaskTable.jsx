import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Paper, Typography, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import WorkDoneGrid from "./WorkDoneGrid";
import ProgressDisplay from "./ProgressDisplay";
import NotesPreview from "./NotesPreview";

const TaskTable = ({ task = {} }) => {
  const taskKey = task._id ?? task.id ?? null;
  const [expanded, setExpanded] = useState(false);
  const [workDones, setWorkDones] = useState(Array.isArray(task?.workDones) ? task.workDones : []);

  useEffect(() => {
    setWorkDones(Array.isArray(task?.workDones) ? task.workDones : []);
  }, [task?.workDones]);

  const approvalNote = task?.approvalNote ?? task?.approveNote ?? task?.approvalNotes ?? null;
  const issueNote = task?.issueNote ?? task?.issueNotes ?? task?.problemNote ?? null;

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }} elevation={1}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1.5,
          py: 1,
          borderBottom: "1px solid #eee",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="body1" fontWeight={600}>
            {task?.operation?.name ?? "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {task?.resource?.name ?? "-"} • Unit: {task?.resource?.unit?.name ?? "-"}
          </Typography>

          <NotesPreview label="Approval note" text={approvalNote} expanded={false} />
          <NotesPreview label="Issue note" text={issueNote} expanded={false} />
        </Box>

        <ProgressDisplay
          workDones={workDones}
          estTotalWork={task?.estTotalWork}
          unitName={task?.resource?.unit?.name}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minWidth: 180,
            justifyContent: "flex-end",
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            Status: {task?.status ?? "In Progress"}
          </Typography>

          <Box
            sx={{ cursor: "pointer" }}
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
        </Box>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2 }}>
          <WorkDoneGrid workDones={workDones} readOnly />
        </Box>
      </Collapse>
    </Paper>
  );
};

TaskTable.propTypes = {
  task: PropTypes.object,
};

export default TaskTable;
