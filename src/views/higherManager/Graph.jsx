import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Typography, Box, CircularProgress } from "@mui/material";

export default function Graph({ data = [], loading = false }) {
  return (
    <Box sx={{ width: "100%", height: 300, minWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Land Progress
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="Total Lands"
              fill="#3f51b5"
            />
            <Bar
              dataKey="Lands In-progress"
              fill="#9c27b0"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}