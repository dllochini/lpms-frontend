// import {
//   Typography,
//   Box,
//   Paper,
//   Breadcrumbs,
//   Grid,
//   Card,
//   CardContent,
// } from "@mui/material";
// import HomeIcon from "@mui/icons-material/Home";
// import { useEffect, useState } from "react";

// import Graph from "../../components/higherManager/Graph";
// import Coverage from "../../components/higherManager/Coverage";

// function Dashboard() {

//   const [userName, setUserName] = useState("");
  
//     useEffect(() => {
//       setUserName(localStorage.getItem("name") || "");
//     }, []);

  
//   const [overview] = useState({
//     totalLands: 0,
//     fieldOfficers: 0,
//     pendingOps: 0,
//     pendingPayments: 0,
//   });

//   const [requests] = useState([]);
//   const [payments] = useState([]);

//   useEffect(() => {
//     // fetch real data if needed
//   }, []);

//   // control the horizontal offset of the whole table-group (positive -> push right)
//   const tableGroupOffset = 20; // pixels; change this to increase/decrease right-nudge
//   // control width of each table card (min)
//   const tableCardMinWidth = 420;

//   return (
//     <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>
//       {/* Breadcrumbs */}
//       <Paper
//         sx={{
//           mx: "auto",
//           p: 3,
//           mb: 3,
//           borderRadius: 4,
//           background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
//         }}
//         elevation={0}
//       >
//         <Typography variant="h5" gutterBottom>
//           Hello {userName} 👋
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Welcome back to the Agricultural Land Preparation System Dashboard.
//         </Typography>
//       </Paper>
//       <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", pl: 2 }}>
//         <Typography color="text.primary">
//           <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
//           Home
//         </Typography>
//       </Breadcrumbs>

//       {/* MAIN CARD: Division Overview (only small stat cards) */}
//       <Paper
//         elevation={5}
//         sx={{
//           maxWidth: 925,
//           mx: "auto",
//           p: 3,
//           borderRadius: 5,
//           mb: 3,
//           backgroundColor: "#fdfdfd",
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Overall Overview
//         </Typography>

//         {/* Center the small stat cards as a group */}
//         <Grid
//           container
//           spacing={2}
//           justifyContent="center"
//           alignItems="center"
//           sx={{ mb: 1 }}
//         >
//           {[
//             { label: "Total lands", value: overview.totalLands },
//             { label: "Total Area(Acres)", value: overview.fieldOfficers },
//             { label: "Number of Division", value: overview.pendingOps },
//             { label: "Lands in Progress", value: overview.pendingPayments },
//           ].map((item, idx) => (
//             <Grid
//               item
//               key={idx}
//               xs="auto"
//               sx={{ display: "flex", justifyContent: "center" }}
//             >
//               <Card
//                 elevation={2}
//                 sx={{
//                   borderRadius: 4,
//                   bgcolor: "#fff",
//                   boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
//                   textAlign: "center",
//                   minWidth: 140,
//                   px: 2,
//                 }}
//               >
//                 <CardContent sx={{ py: 2 }}>
//                   <Typography
//                     variant="h4"
//                     sx={{ fontWeight: "700", lineHeight: 1 }}
//                   >
//                     {item.value}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ mt: 1 }}
//                   >
//                     {item.label}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Paper>

//       {/* ---------------------------
//           TABLES: OUTSIDE the MAIN CARD,
//           centered under it but nudged slightly to the right
//           --------------------------- */}
//       <Box
//         sx={{
//           maxWidth: 1000,
//           mx: "auto",
//           // transform nudges the whole group to the right by tableGroupOffset px.
//           // On small screens this transform still applies but cards will stack.
//           transform: `translateX(${tableGroupOffset}px)`,
//         }}
//       >
//         <Grid
//           container
//           spacing={3}
//           justifyContent="center" // center the group under the main card
//           alignItems="flex-start"
//         >
//           {/* Requests card (auto-sized) */}
//           {/* centered, auto-sized card */}
//           <Grid
//             item
//             xs="auto"
//             md="auto"
//             sx={{ display: "flex", justifyContent: "center" }}
//           >
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 2,
//                 borderRadius: 3,
//                 border: "1px solid #eee",
//                 minWidth: tableCardMinWidth, // number is treated as px by MUI
//                 width: { xs: "100%", md: "auto" }, // full width on small screens, auto on md+
//                 display: "flex",
//                 flexDirection: "column",
//                 mx: "auto", // centers the Paper inside the grid cell
//               }}
//             >
//               <div style={{ width: "100%" }}>
//                 <Graph />
//               </div>
//             </Paper>
//           </Grid>

//           {/* Payments card (auto-sized) */}
//           <Grid
//             item
//             xs={12}
//             md="auto"
//             sx={{ display: "flex", justifyContent: "center" }}
//           >
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 2,
//                 borderRadius: 3,
//                 border: "1px solid #eee",
//                 minWidth: `${tableCardMinWidth}px`,
//                 width: { xs: "100%", md: "auto" },
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <div style={{ width: "100%" }}>
//                 <Coverage />
//               </div>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// }

// export default Dashboard;



// src/views/higherManager/Dashboard.jsx
import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useState } from "react";

import Graph from "../../components/higherManager/Graph";
import Coverage from "../../components/higherManager/Coverage";

function Dashboard() {
  const [userName, setUserName] = useState("");
  const [overview, setOverview] = useState({
    totalLands: 0,
    totalArea: 0,
    divisions: 0,
    landsInProgress: 0,
  });
  const [graphData, setGraphData] = useState([]);
  const [coverageData, setCoverageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // get friendly user name
  useEffect(() => {
    setUserName(localStorage.getItem("name") || "");
  }, []);

  // fetch backend dashboard data
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);

      // try to find manager id from localStorage (common keys)
      const higherManagerId =
        localStorage.getItem("higherManagerId") ||
        localStorage.getItem("userId") ||
        localStorage.getItem("id");

      if (!higherManagerId) {
        setError("HigherManager ID not found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const resp = await fetch(`/api/manager/${higherManagerId}/dashboard`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal,
        });

        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Server error: ${resp.status} ${text}`);
        }

        const data = await resp.json();

        // Defensive: ensure data shape exists
        const ov = data.overview || {};
        setOverview({
          totalLands: ov.totalLands ?? 0,
          totalArea: ov.totalArea ?? 0,
          divisions: ov.divisions ?? 0,
          landsInProgress: ov.landsInProgress ?? 0,
        });

        setGraphData(Array.isArray(data.graph) ? data.graph : []);
        setCoverageData(Array.isArray(data.coverage) ? data.coverage : []);

      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch dashboard:", err);
          setError(err.message || "Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();

    return () => controller.abort();
  }, []);

  // control the horizontal offset of the whole table-group (positive -> push right)
  const tableGroupOffset = 20; // pixels; change this to increase/decrease right-nudge
  // control width of each table card (min)
  const tableCardMinWidth = 420;

  return (
    <Box sx={{ maxWidth: 1150, mx: "auto", p: 3 }}>
      {/* Breadcrumbs */}
      <Paper
        sx={{
          mx: "auto",
          p: 3,
          mb: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
        }}
        elevation={0}
      >
        <Typography variant="h5" gutterBottom>
          Hello {userName} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back to the Agricultural Land Preparation System Dashboard.
        </Typography>
      </Paper>

      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", pl: 2 }}>
        <Typography color="text.primary">
          <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
          Home
        </Typography>
      </Breadcrumbs>

      {/* Error / Loading indicator */}
      {error && (
        <Box sx={{ maxWidth: 925, mx: "auto", mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* MAIN CARD: Division Overview (only small stat cards) */}
      <Paper
        elevation={5}
        sx={{
          maxWidth: 925,
          mx: "auto",
          p: 3,
          borderRadius: 5,
          mb: 3,
          backgroundColor: "#fdfdfd",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Overall Overview
        </Typography>

        {/* Center the small stat cards as a group */}
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          {[
            { label: "Total lands", value: overview.totalLands },
            { label: "Total Area (Acre)", value: overview.totalArea },
            { label: "Number of Division", value: overview.divisions },
            { label: "Lands in Progress", value: overview.landsInProgress },
          ].map((item, idx) => (
            <Grid
              item
              key={idx}
              xs="auto"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                elevation={2}
                sx={{
                  borderRadius: 4,
                  bgcolor: "#fff",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
                  textAlign: "center",
                  minWidth: 140,
                  px: 2,
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: "700", lineHeight: 1 }}>
                    {loading ? <CircularProgress size={22} /> : item.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {item.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* ---------------------------
          TABLES: OUTSIDE the MAIN CARD,
          centered under it but nudged slightly to the right
          --------------------------- */}
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          // transform nudges the whole group to the right by tableGroupOffset px.
          // On small screens this transform still applies but cards will stack.
          transform: `translateX(${tableGroupOffset}px)`,
        }}
      >
        <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
          {/* Graph card */}
          <Grid item xs="auto" md="auto" sx={{ display: "flex", justifyContent: "center" }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #eee",
                minWidth: tableCardMinWidth,
                width: { xs: "100%", md: "auto" },
                display: "flex",
                flexDirection: "column",
                mx: "auto",
              }}
            >
              <div style={{ width: "100%" }}>
                {/* pass data to Graph; Graph should accept `data` prop */}
                <Graph data={graphData} loading={loading} />
              </div>
            </Paper>
          </Grid>

          {/* Coverage card */}
          <Grid item xs={12} md="auto" sx={{ display: "flex", justifyContent: "center" }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #eee",
                minWidth: `${tableCardMinWidth}px`,
                width: { xs: "100%", md: "auto" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ width: "100%" }}>
                {/* pass data to Coverage; Coverage should accept `data` prop */}
                <Coverage data={coverageData} loading={loading} />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;

