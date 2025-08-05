import React from "react";
import {
  Typography,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Grid,
  Paper,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import MainGrid from "../../components/MainGrid";

const divisionsData = [
  { name: "Western", area: 1200, prepared: 300 },
  { name: "Central", area: 800, prepared: 200 },
  { name: "Southern", area: 650, prepared: 150 },
  { name: "Northern", area: 500, prepared: 100 },
  { name: "Eastern", area: 900, prepared: 400 },
];

const pieData = [
  { name: "Prepared", value: 1150 },
  { name: "Cultivated", value: 2500 },
  { name: "Harvested", value: 800 },
];
// const COLORS = ["#ff9800", "#4caf50", "#2196f3"];

const ExecutiveDashboard = () => {
  const totalArea = divisionsData.reduce((sum, d) => sum + d.area, 0);
  const totalPrepared = divisionsData.reduce((sum, d) => sum + d.prepared, 0);

  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb">
        {/* <Link underline="hover" color="inherit" href="/">
          MUI
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/material-ui/getting-started/installation/"
        >
          Core
        </Link> */}
        <Typography sx={{ color: "text.primary" }}>Home</Typography>
      </Breadcrumbs>

      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="left"
        mb={1}
        mt={2}
        ml={3}
      >
        Dashboard
      </Typography>

<Paper sx={{m:4, p:4}}>
 <MainGrid />
</Paper>
     

      <Paper sx={{ p: 0.5, mx: 5, my: 3, height: "100vh" }}>
        {/* KPI CARDS */}
        <Grid
          container
          spacing={2}
          sx={{ m: 5, justifyContent: "space-evenly" }}
        >
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Area</Typography>
                <Typography variant="h5">{totalArea} ha</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Prepared</Typography>
                <Typography variant="h5">{totalPrepared} ha</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Top Division</Typography>
                <Typography variant="h5">Western</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">% Prepared</Typography>
                <Typography variant="h5">
                  {((totalPrepared / totalArea) * 100).toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <PieChart
          sx={{ border: "2px solid black", height: "45vh", width: "30%" }}
          series={[
            {
              data: [
                { id: 0, value: 1150, label: "Prepared" },
                { id: 1, value: 2500, label: "Cultivated" },
                { id: 2, value: 800, label: "Harvested" },
              ],
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 5,
              startAngle: -45,
              endAngle: 225,
              cx: 150,
              cy: 150,
            },
          ]}
        />
      </Paper>
    </>
  );
};

export default ExecutiveDashboard;
