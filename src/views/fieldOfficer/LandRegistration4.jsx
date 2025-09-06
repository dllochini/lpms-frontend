import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Button,
  Divider,
  Grid,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Checkbox, FormControlLabel } from "@mui/material";
import FormStepper from "../components/FormStepper.jsx";

const LandRegistrationSubmission = () => {
  const [agreementFile, setAgreementFile] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleFileChange = (file) => {
    setAgreementFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreementFile || !confirmed) {
      alert("Please upload the agreement and confirm approval.");
      return;
    }
    console.log("Uploaded file:", agreementFile);
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        {/* Header */}
        <Typography variant="h5" gutterBottom>
          Farmer and Land Registration
        </Typography>

        {/* Stepper (Step 4 active) */}
        <FormStepper activeStep={3} />

        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Link underline="hover" color="inherit" href="/">
            <HomeIcon
              sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }}
            />
            Home
          </Link>
          <Typography color="text.primary">Add New Farmer & Land</Typography>
        </Breadcrumbs>
      </Box>

      {/* Upload Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", justifyContent: "center", mb: 3 }}
      >
        <Paper
          elevation={5}
          sx={{ maxWidth: 700, mx: "auto", p: 3, borderRadius: 5 }}
        >
          <Typography variant="h6" gutterBottom>
            Submission
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Agreement Upload */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <Typography>Agreement :</Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
                sx={{ width: "100%", textAlign: "left" }}
              >
                {agreementFile?.name || "Link or drag and drop"}
                <input
                  type="file"
                  hidden
                  accept=".jpg,.jpeg,.png,.gif,.svg"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                SVG, PNG, JPG or GIF (max: 3MB)
              </Typography>
            </Grid>
          </Grid>

          {/* Checkbox + Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
              }
              label="I confirm that this submission has been reviewed and approved by the Legal Officer."
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined">Back</Button>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LandRegistrationSubmission;
