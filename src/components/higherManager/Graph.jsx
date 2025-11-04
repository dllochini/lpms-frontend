// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell, // Import Cell
// } from "recharts";
// import { Typography, Box, CircularProgress } from "@mui/material";

// // Helper to format the data keys (e.g., "in progress" -> "In Progress")
// const capitalize = (s) => {
//   if (!s) return "";
//   return s
//     .split(" ")
//     .map((word) => word[0].toUpperCase() + word.slice(1))
//     .join(" ");
// };

// export default function Graph({ data = [], loading = false }) {
//   // 1. Transform the data from the API into the format Recharts expects
//   const chartData = data.map((item) => ({
//     name: capitalize(item._id), // e.g., "In Progress"
//     value: item.count,
//   }));

//   // Define the order and color for the bars
//   const progressOrder = ["Pending", "In Progress", "Completed"];
//   const barColors = {
//     Pending: "#f44336", // Red
//     "In Progress": "#ff9800", // Orange
//     Completed: "#4caf50", // Green
//   };

//   // Sort the data to ensure the bars are always in the correct order
//   const sortedData = chartData.sort(
//     (a, b) => progressOrder.indexOf(a.name) - progressOrder.indexOf(b.name)
//   );

//   return (
//     <Box sx={{ width: "100%", height: 300, minWidth: 300 }}>
//       <Typography variant="h6" gutterBottom>
//         Land Preparation Progress
//       </Typography>
//       {loading ? (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "100%",
//           }}
//         >
//           <CircularProgress />
//         </Box>
//       ) : (
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={sortedData}
//             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis allowDecimals={false} />
//             <Tooltip />
//             <Legend />
//             {/* Use Cell to give each bar a specific color */}
//             <Bar dataKey="value" name="Task Count">
//               {sortedData.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={barColors[entry.name] || "#8884d8"}
//                 />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       )}
//     </Box>
//   );
// }

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
        data={data} // The data from the API now perfectly matches
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Legend />
    {/* Blue bar for 'Total Lands' */}
      <Bar
        dataKey="Total Lands"
        fill="#3f51b5" // A nice blue
      />
      {/* Purple bar for 'Lands In-progress' */}
      <Bar
        dataKey="Lands In-progress"
        fill="#9c27b0" // A nice purple
      />
   </BarChart>
   </ResponsiveContainer>
   )}
  </Box>
 );
}