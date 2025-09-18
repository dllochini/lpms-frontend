import React from "react";
import {
    Typography,
    Box,
    Paper,
    Breadcrumbs,
    Grid,
    Card,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useState } from "react";

const PaymentApproval = () => {



return (
    <Box sx={{ mb: 4 }}>
      {/* Top Nav */}
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 2 }}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" size="small" sx={{ borderRadius: 20, px: 3 }}>
            Home
          </Button>
          {/* <Button variant="outlined" size="small" sx={{ borderRadius: 20, px: 3 }}>
            Operations Approval
          </Button> */}
          <Button variant="outlined" size="small" sx={{ borderRadius: 20, px: 3 }}>
            Payments Approval
          </Button>
          <Button variant="outlined" size="small" sx={{ borderRadius: 20, px: 3 }}>
            Land Progress
          </Button>
        </Stack>
      </Box>
    </Box>
    );
};

export default PaymentApproval;