// File: LandRegistration3.jsx
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
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FormStepper from "../../../components/fieldOfficer/CreateLandFormStepper.jsx";
import { useNavigate } from "react-router-dom";
import { saveFile, getAllFiles, deleteFile } from "../../../utils/db.js";
import {
  getWithExpiry,
  setWithExpiry,
} from "../../../utils/localStorageHelpers.js";

const FILE_KEYS = {
  titleDeed: "titleDeed_file",
  extract: "extract_file",
  surveyPlan: "surveyPlan_file",
  taxReceipts: "taxReceipts_file",
  streetLine: "streetLine_file",
  certificate: "certificate_file",
  zoning: "zoning_file",
};

const documentFields = [
  { name: "titleDeed", label: "Title Deed* (Ownership Deed)" },
  {
    name: "extract",
    label: "Extract (Bim Saha Lipi) from Land Registry (Certified Copy)*",
  },
  {
    name: "surveyPlan",
    label: "Survey Plan (Document of Licensed Surveyor’s Plan)*",
  },
  { name: "taxReceipts", label: "Tax Receipts & Assessment Extracts*" },
  { name: "streetLine", label: "Street Line / Building Line*" },
  { name: "certificate", label: "Certificate of Non-Vesting*" },
  { name: "zoning", label: "Development / Zoning Certificates*" },
];

const LandRegistration3 = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState({});

  // Load files from IndexedDB on mount
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const storedFiles = await getAllFiles();
        setFiles(storedFiles || {});
      } catch (err) {
        console.error("Failed to load files from IndexedDB:", err);
      }
    };
    loadFiles();
  }, []);

  // Save file and store reference with expiry
  const handleFileChange = async (name, file) => {
    if (!file) return;
    const key = FILE_KEYS[name];

    // update UI state
    setFiles((prev) => ({ ...prev, [key]: file }));

    try {
      await saveFile(key, file);

      // keep track of multiple files
      const existing = getWithExpiry("landRegForm3") || {};
      const newFiles = { ...(existing.files || {}), [name]: key };

      setWithExpiry(
        "landRegForm3",
        { ...(existing || {}), files: newFiles },
        30 * 60 * 1000
      );
    } catch (err) {
      console.error(`Failed to save file ${name}:`, err);
    }
  };

  // Optional: cleanup expired files
  useEffect(() => {
    const cleanupExpiredFiles = async () => {
      const expired = !getWithExpiry("landRegForm3");
      if (expired) {
        for (const key of Object.values(FILE_KEYS)) {
          await deleteFile(key);
        }
        setFiles({});
      }
    };
    cleanupExpiredFiles();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure all required documents are uploaded (use FILE_KEYS)
    const missing = documentFields.filter((doc) => !files[FILE_KEYS[doc.name]]);
    if (missing.length) {
      alert(
        `Please upload all required documents: ${missing
          .map((m) => m.label)
          .join(", ")}`
      );
      return;
    }

    // Navigate to next step
    navigate("/fieldOfficer/landRegistration4");
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Farmer and Land Registration
        </Typography>

        <FormStepper activeStep={2} />

        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Link underline="hover" color="inherit" href="/">
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/fieldOfficer/landRegistry">
            Land Registry
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
            Document Upload
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2} direction="column">
            {documentFields.map((doc) => (
              <Grid
                key={doc.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Typography sx={{ minWidth: 280 }}>{doc.label}</Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                  sx={{ flex: 1, textAlign: "left" }}
                >
                  {files[FILE_KEYS[doc.name]]?.name || "Link or drag and drop"}
                  <input
                    type="file"
                    hidden
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                      handleFileChange(doc.name, e.target.files[0])
                    }
                  />
                </Button>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/fieldOfficer/landRegistration2")}
            >
              Back
            </Button>

            <Button variant="contained" type="submit">
              Next
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LandRegistration3;
