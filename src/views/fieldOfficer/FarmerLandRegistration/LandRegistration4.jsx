// File: LandRegistration4.jsx
import { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FormStepper from "../../../components/fieldOfficer/CreateLandFormStepper.jsx";
import { useNavigate } from "react-router-dom";
import { getAllFiles, deleteFile } from "../../../utils/db.js";
import {
  getWithExpiry,
  setWithExpiry,
} from "../../../utils/localStorageHelpers.js";
import { createUserLand } from "../../../api/land.js";

const LandRegistration4 = () => {
  const navigate = useNavigate();
  const [agreementFile, setAgreementFile] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});

  // Load previously saved files from IndexedDB
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const files = await getAllFiles();
        setUploadedFiles(files || {});
      } catch (err) {
        console.error("Failed to load files:", err);
      }
    };
    loadFiles();
  }, []);

  // landRegForm1 and landForm2 may be stored as wrapper { data, fileKey }
  const form1Wrapper = getWithExpiry("landRegForm1") || null; // Farmer info wrapper
  const form2Wrapper = getWithExpiry("landForm2") || null; // Land info wrapper

  const form1 = form1Wrapper?.data || form1Wrapper || {};
  const form2 = form2Wrapper?.data || form2Wrapper || {};

  const handleFinalSubmission = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      // get logged userId
      const loggedUserId = localStorage.getItem("loggedUserId");
      if (loggedUserId) {
        formData.append("createdBy", loggedUserId);
        formData.append("updatedBy", loggedUserId);
      }

      // --- Step 1 (farmer info) ---

      if (form1 && Object.keys(form1).length) {
        Object.entries(form1).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value); // <--- flatten
          }
        });
        if (form1Wrapper?.fileKey) {
          const f = uploadedFiles[form1Wrapper.fileKey];
          if (f) formData.append("farmerPhoto", f, f.name);
        }
      }

      // --- Step 2 (land info) ---
      if (form2 && Object.keys(form2).length) {
        Object.entries(form2).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value); // <--- flatten
          }
        });
        if (form2Wrapper?.fileKey) {
          const lf = uploadedFiles[form2Wrapper.fileKey];
          if (lf) formData.append("landPhoto", lf, lf.name);
        }
      }

      // --- Step 3 (uploaded documents) ---
      const form3Wrapper = getWithExpiry("landRegForm3") || {};
      const filesMap = form3Wrapper.files || {};
      // GOOD: append every document as 'documents' (multiple values)
      for (const fileKey of Object.values(filesMap || {})) {
        const fileObj = uploadedFiles[fileKey];
        if (fileObj) {
          formData.append("documents", fileObj, fileObj.name);
        }
      }

      // --- Signed agreement (final step) ---
      if (agreementFile) {
        formData.append("signedAgreement", agreementFile, agreementFile.name);
      }

      // Debug log
      for (let [k, v] of formData.entries()) {
        console.log("formData entry:", k, v);
      }

      const res = await createUserLand(formData);
      console.log("Submission response:", res.data);

      setOpenSnackbar(true);

      // cleanup local storage and optionally delete saved files from IndexedDB
      // cleanup local storage and delete files referenced in filesMap
      localStorage.removeItem("landRegForm1");
      localStorage.removeItem("landRegForm2");
      localStorage.removeItem("landRegForm3");

      // delete saved files referenced in filesMap (and the farmer/land fileKeys)
      const allKeysToDelete = new Set([
        ...(form1Wrapper?.fileKey ? [form1Wrapper.fileKey] : []),
        ...(form2Wrapper?.fileKey ? [form2Wrapper.fileKey] : []),
        ...Object.values(filesMap || {}),
      ]);

      for (const key of allKeysToDelete) {
        try {
          await deleteFile(key);
        } catch (err) {
          console.warn("Failed to delete indexedDB file:", key, err);
        }
      }

      // refresh local file list used on the submission page
      try {
        const remaining = await getAllFiles();
        setUploadedFiles(remaining || {});
      } catch (err) {
        setUploadedFiles({});
      }

      // optionally also clear any local states
      setAgreementFile(null);

      // Now navigate (we keep small delay for UX if you want feedback toast)
      setTimeout(() => navigate("/fieldOfficer"), 1200);
    } catch (error) {
      console.error(error);
      setSubmitError(
        error.response?.data?.error || error.message || "Submission failed"
      );
    } finally {
      setLoading(false);
      setOpenConfirm(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreementFile || !confirmed) {
      alert("Please upload the agreement and confirm approval.");
      return;
    }
    setOpenConfirm(true);
  };

  return (
    <>
      <Box sx={{ minHeight: "100vh" }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Farmer and Land Registration
          </Typography>

          <FormStepper activeStep={3} />

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

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", justifyContent: "center", mb: 3 }}
        >
          <Paper
            elevation={5}
            sx={{ maxWidth: "70%", mx: "auto", px: 10, py: 5, borderRadius: 5 }}
          >
            <Typography variant="h6" gutterBottom>
              Submission
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container direction="column" spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ minWidth: 120 }}>Agreement :</Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                >
                  {agreementFile?.name || "Upload Agreement"}
                  <input
                    type="file"
                    hidden
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setAgreementFile(e.target.files[0])}
                  />
                </Button>
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                  />
                }
                label="I confirm this submission has been reviewed and approved by the Legal Officer."
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  pt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Back
                </Button>

                <Button variant="contained" type="submit" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </Box>
            </Grid>
          </Paper>
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>Are you sure you want to submit the form?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleFinalSubmission} variant="contained">
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

export default LandRegistration4;
