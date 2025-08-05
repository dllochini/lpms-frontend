import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from "./ChartUserByCountry";
import CustomizedTreeView from "./CustomizedTreeView";
import CustomizedDataGrid from "./CustomizedDataGrid";
import HighlightedCard from "./HighlightedCard";
import PageViewsBarChart from "./PageViewsBarChart";
import SessionsChart from "./SessionsChart";
import StatCard from "./StatCard";

const data = [
  {
    title: "Registered Farmers",
    value: "2,450",
    interval: "Last 30 days",
    trend: "up",
    data: [
      40, 42, 45, 48, 50, 55, 60, 65, 68, 70, 75, 80, 82, 85, 88, 92, 95, 98,
      100, 102, 105, 108, 110, 115, 118, 120, 122, 125, 128, 130,
    ],
  },
  {
    title: "Registered Lands",
    value: "2,558",
    interval: "Last 30 days",
    trend: "up",
    data: [
      40, 42, 45, 48, 50, 55, 60, 65, 68, 70, 75, 80, 82, 85, 88, 92, 95, 98,
      101, 103, 105, 108, 106, 107, 120, 122, 122, 125, 128, 122,
    ],
  },
  {
    title: "Land Prepared",
    value: "1,250 acres",
    interval: "Last 30 days",
    trend: "up",
    data: [
      30, 40, 50, 45, 55, 60, 65, 70, 75, 80, 85, 90, 95, 110, 120, 125, 130,
      135, 140, 145, 150, 160, 165, 170, 175, 180, 185, 190, 200, 210,
    ],
  },
];

export default function MainGrid() {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        // border={2}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: "column", sm: "row", lg: "column" }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>
      {/* <Copyright sx={{ my: 4 }} /> */}
    </Box>
  );
}
