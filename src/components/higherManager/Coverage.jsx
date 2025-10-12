
// src/components/higherManager/Coverage.jsx
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

const COLORS = ["#FF00FF", "#00BFFF", "#20B2AA", "#8A2BE2", "#FFA500", "#8B0000"];

const Coverage = ({ data = [], loading = false }) => {
  // data expected: [{ name, value }]
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Land Coverage
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : data.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>No coverage data available</Box>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

export default Coverage;
