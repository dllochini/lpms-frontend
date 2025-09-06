import {
    Typography,
    Box,
    Paper,
    Breadcrumbs,
    Link,
    Button,
    Stack
  } from "@mui/material";
  import HomeIcon from "@mui/icons-material/Home";
  import { useState, useEffect } from "react";
  import { Link as RouterLink } from "react-router-dom";
  import BasicDataGrid from "../../components/manager/PendingPaymentDataGrid";
  
  export default function PaymentApproval() {
    const [rows, setRows] = useState([]);
  
    useEffect(() => {
      // Fetch your pending payments API here
      setRows([
        {
          id: "B1234",
          billId: "B1234",
          landId: "L1234",
          fieldOfficer: "Alex Jones",
          accountant: "Alex Jones",
          requestedDate: "2025-08-12"
        },
        {
          id: "B1235",
          billId: "B1235",
          landId: "L1235",
          fieldOfficer: "Chris Smith",
          accountant: "John Doe",
          requestedDate: "2025-08-13"
        }
      ]);
    }, []);
  
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        {/* Top Navigation Buttons */}
        <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 2 }}
            >
          <Button
            variant="outlined"
            component={RouterLink}
            to="/"
          >
            Home
          </Button>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/operations"
          >
            Operations Approval
          </Button>
          <Button
            variant="contained" // highlight current page
            color="primary"
            component={RouterLink}
            to="/payments"
          >
            Payments Approval
          </Button>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/land-progress"
          >
            Land Progress
          </Button>
        </Stack>
  
        {/* Title + Breadcrumb */}
        <Typography variant="h5" gutterBottom>
          Pending Payment Approval
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem", mb: 2 }}>
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Home
          </Link>
          <Typography color="text.primary">Payments Approval</Typography>
        </Breadcrumbs>
  
        {/* Table */}
        <Paper elevation={5} sx={{ p: 3, borderRadius: 3 }}>
          <BasicDataGrid rows={rows} />
        </Paper>
      </Box>
    );
  }
  