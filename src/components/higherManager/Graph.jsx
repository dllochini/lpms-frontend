
// src/components/higherManager/Graph.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, CircularProgress } from "@mui/material";

const Graph = ({ data = [], loading = false }) => {
  // data expected: [{ name, total, progress }]
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Lands Overview
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : data.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>No data available</Box>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="progress" name="Lands in progress" />
            <Bar dataKey="total" name="Total Lands" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default Graph;
