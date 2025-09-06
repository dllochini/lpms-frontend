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
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FormStepper from "../components/FormStepper.jsx";
import { useNavigate } from "react-router-dom";

const LandRegistrationSubmission = () => {
  const [agreementFile, setAgreementFile] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (file) => {
    setAgreementFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreementFile || !confirmed) {
      alert("Please upload the agreement and confirm approval.");
      return;
    }
    setOpenConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setOpenConfirm(false);
    try {
      // Example: upload file using FormData
      const formData = new FormData();
      formData.append("agreementFile", agreementFile);
      formData.append("confirmed", confirmed);

      // Replace with your API endpoint
      const response = await fetch("/api/submit-land-registration", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Submission failed");
      setOpenSnackbar(true);

      // Reset form after successful submit
      setAgreementFile(null);
      setConfirmed(false);

      // Redirect after 2 seconds
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box sx={{ minHeight: "100vh" }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
          {/* Header */}
          <Typography variant="h5" gutterBottom>
            Farmer and Land Registration
          </Typography>

          {/* Stepper */}
          <FormStepper activeStep={3} />

          {/* Breadcrumbs */}
          <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
            <Link underline="hover" color="inherit" href="/">
              <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
              Home
            </Link>
            <Typography color="text.primary">Add New Farmer & Land</Typography>
          </Breadcrumbs>
        </Box>

        {/* Form */}
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

            <Grid container spacing={2} alignItems="center">
              {/* Agreement Upload */}
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

              {/* Confirmation Checkbox */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                    />
                  }
                  label="I confirm that this submission has been reviewed and approved by the Legal Officer."
                />
              </Grid>

              {/* Buttons */}
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Back
                </Button>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          Are you sure you want to submit the form?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmSubmit} variant="contained" color="primary">
            Yes, Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          Submission successful! Redirecting...
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!submitError}
        autoHideDuration={4000}
        onClose={() => setSubmitError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setSubmitError("")}>
          {submitError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LandRegistrationSubmission;
