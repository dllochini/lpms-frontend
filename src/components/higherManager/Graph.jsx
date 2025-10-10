// graph.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const barData = [
  // { name: "DivA", total: 30, progress: 10 },
  // { name: "DivB", total: 60, progress: 25 },
  // { name: "DivC", total: 30, progress: 20 },
  // { name: "DivD", total: 60, progress: 15 },
  // { name: "DivE", total: 30, progress: 20 },
  // { name: "DivF", total: 60, progress: 25 },
  // { name: "DivG", total: 30, progress: 15 },
];


const COLORS = ["#FF00FF", "#00BFFF", "#20B2AA", "#8A2BE2"];

const Graph = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Bar Chart */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Lands Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="progress" fill="#FF00FF" name="Lands in progress" />
            <Bar dataKey="total" fill="#00BFFF" name="Total Lands" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graph;
