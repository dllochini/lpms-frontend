import React from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";

const NotesPreview = ({ label, text, expanded, onToggle, maxLength = 120 }) => {
  if (!text) return null;
  const clean = String(text);
  const needsTruncate = clean.length > maxLength;
  const preview = needsTruncate ? `${clean.slice(0, maxLength)}…` : clean;

  return (
    <Box sx={{ mt: 0.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {label}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="body2"
          sx={{
            whiteSpace: "pre-wrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 420,
          }}
        >
          {expanded ? clean : preview}
        </Typography>

        {needsTruncate && (
          <Button size="small" onClick={onToggle}>
            {expanded ? "Show less" : "Show more"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

NotesPreview.propTypes = {
  label: PropTypes.string,
  text: PropTypes.string,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  maxLength: PropTypes.number,
};

export default NotesPreview;
