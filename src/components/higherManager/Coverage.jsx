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

const pieData = [
  { name: "DivA", value: 100 },
  { name: "DivB", value: 80 },
  { name: "DivC", value: 90 },
  { name: "DivD", value: 120 },
];

const COLORS = ["#FF00FF", "#00BFFF", "#20B2AA", "#8A2BE2"];

const Coverage = () => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Land Coverage</h2>
                <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                    dataKey="value"
                    >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
            </div>
        );
};

export default Coverage;