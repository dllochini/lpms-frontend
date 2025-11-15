import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Box, Typography, CircularProgress } from "@mui/material";

// Define specific colors for each status
const STATUS_COLORS = {
  Pending: "#f44336", // Red
  "In Progress": "#ff9800", // Orange
  Completed: "#4caf50", // Green
};

// Define the order
const STATUS_ORDER = ["Pending", "In Progress", "Completed"];

const TaskSummary = ({ data = {}, loading = false }) => {
  // 1. Transform the data from the API object:
  //    { pending: 10, inProgress: 5, completed: 8 }
  //    to the format Recharts expects:
  //    [{ name: "Pending", value: 10 }, ...]
  const chartData = [
    { name: "Pending", value: data.pending || 0 },
    { name: "In Progress", value: data.inProgress || 0 },
    { name: "Completed", value: data.completed || 0 },
  ].filter((item) => item.value > 0); // Only show slices with a value > 0

  // 2. Sort the data to match the defined order
  const sortedData = chartData.sort(
    (a, b) => STATUS_ORDER.indexOf(a.name) - STATUS_ORDER.indexOf(b.name)
  );

  const total = sortedData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Task Status Summary
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : total === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>No task data available</Box>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sortedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              // label shows the percent computed from value / total
              label={({ value }) => `${Math.round((value / total) * 100)}%`}
              labelLine={false}
            >
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.name] || "#8884d8"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default TaskSummary;
