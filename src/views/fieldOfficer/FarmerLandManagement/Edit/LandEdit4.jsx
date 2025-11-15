// File: LandEdit4.jsx
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
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FormStepper from "../CreateLandFormStepper.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { getLandById, updateLandById } from "../../../../api/land.js";

const LandEdit4 = () => {
  const navigate = useNavigate();
  const { landId } = useParams();

  const [land, setLand] = useState(null);
  const [agreementFile, setAgreementFile] = useState(null);
  const [existingAgreement, setExistingAgreement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const loadLand = async () => {
      try {
        const res = await getLandById(landId);
        setLand(res.data);

        // Load existing agreement
        if (res.data.signedAgreement) {
          setExistingAgreement(res.data.signedAgreement);
        } else if (res.data.documents && res.data.documents.length) {
          const agreementDoc =
            res.data.documents.find((d) =>
              d.filename.toLowerCase().includes("agreement")
            ) || res.data.documents[res.data.documents.length - 1];
          setExistingAgreement(agreementDoc);
        }
      } catch (err) {
        console.error("Failed to load land:", err);
      }
    };
    loadLand();
  }, [landId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();

      // Append agreement if a new file is uploaded
      if (agreementFile) {
        formData.append("signedAgreement", agreementFile, agreementFile.name);
      }

      const res = await updateLandById(landId, formData);
      console.log("Update response:", res.data);
      setOpenSnackbar(true);
      setTimeout(() => navigate("/fieldOfficer/landRegistry"), 1500);
    } catch (err) {
      console.error(err);
      setSubmitError(
        err.response?.data?.error || err.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ minHeight: "100vh" }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Edit Land Registration
          </Typography>

          <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
            <Link underline="hover" color="inherit" href="/">
              <HomeIcon
                sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }}
              />
              Home
            </Link>
            <Typography color="text.primary">Edit Land</Typography>
          </Breadcrumbs>
          <Box sx={{ mt: 4 }}>
            <FormStepper activeStep={3} />
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", justifyContent: "center", mb: 3 }}
        >
          <Paper
            elevation={5}
            sx={{ width: "70%", mx: "auto", px: 10, py: 5, borderRadius: 5 }}
          >
            <Typography variant="h6" gutterBottom>
              Signed Agreement
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container direction="column" spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ minWidth: 120 }}>Agreement:</Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                >
                  {agreementFile
                    ? agreementFile.name
                    : existingAgreement
                    ? existingAgreement.filename
                    : "Upload Agreement"}
                  <input
                    type="file"
                    hidden
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setAgreementFile(e.target.files[0])}
                  />
                </Button>
              </Box>

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
                  {loading ? <CircularProgress size={24} /> : "Update"}
                </Button>
              </Box>
            </Grid>
          </Paper>
        </Box>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          Update successful! Redirecting...
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

export default LandEdit4;
