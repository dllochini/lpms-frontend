import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import CircularProgressWithLabel from "../circularProgressWithLabel";

const ProgressDisplay = ({ workDones = [], estTotalWork = 1, unitName = "" }) => {
  const totalDone = (Array.isArray(workDones) ? workDones : []).reduce(
    (sum, w) => sum + Number(w.newWork || 0),
    0
  );

  const est = Number(estTotalWork) || 1;
  const percent = Math.min((totalDone / est) * 100, 100);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 200 }}>
      <CircularProgressWithLabel size={50} value={percent} />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="body2" color="text.secondary">
          Progress
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {percent.toFixed(1)}%
        </Typography>
      </Box>

      <Box sx={{ ml: 2, textAlign: "right" }}>
        <Typography variant="caption" color="text.secondary">
          Total
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {totalDone} / {est} {unitName ?? ""}
        </Typography>
      </Box>
    </Box>
  );
};

ProgressDisplay.propTypes = {
  workDones: PropTypes.array,
  estTotalWork: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unitName: PropTypes.string,
};

export default ProgressDisplay;
