// File: LandEdit3.jsx
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
import FormStepper from "../CreateLandFormStepper.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { getLandById, updateLandById } from "../../../../api/land.js";

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

const LandEdit3 = () => {
  const navigate = useNavigate();
  const { landId } = useParams();

  const [documents, setDocuments] = useState([]);
  const [newFiles, setNewFiles] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!landId) return;

    const fetchLand = async () => {
      try {
        const res = await getLandById(landId);
        const landData = res?.data;
        // console.log("Fetched land data:", landData);
        if (landData?.documents) {
          setDocuments(landData.documents);
        }
      } catch (err) {
        console.error("Failed to fetch land:", err);
      }
    };

    fetchLand();
  }, [landId]);

  const handleFileChange = (fieldName, file) => {
    if (!file) return;
    setNewFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleReset = () => {
    setNewFiles({});
  };

  const handleSaveNext = async () => {
    if (
      documents.length + Object.keys(newFiles).length <
      documentFields.length
    ) {
      alert("Please ensure all required documents are uploaded");
      return;
    }

    setBusy(true);

    try {
      const formData = new FormData();
      Object.entries(newFiles).forEach(([key, file]) => {
        formData.append("documents", file);
      });

      formData.append("existingDocuments", JSON.stringify(documents));

      await updateLandById(landId, formData);

      navigate(`/fieldOfficer/landEdit4/${landId}`);
    } catch (err) {
      console.error("Failed to save documents:", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Edit Land Documents
        </Typography>

        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Link underline="hover" color="inherit" href="/">
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
            Home
          </Link>
          <Typography color="text.primary">Edit Farmer & Land</Typography>
        </Breadcrumbs>
        <Box sx={{ mt: 4 }}>
          <FormStepper activeStep={2} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Paper
          elevation={5}
          sx={{ width: "70%", mx: "auto", px: 10, py: 5, borderRadius: 5 }}
        >
          <Typography variant="h6" gutterBottom>
            Documents
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2} direction="column">
            {documentFields.map((doc, index) => {
              const existingDoc = documents[index];
              return (
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
                    {newFiles[doc.name]?.name ||
                      existingDoc?.filename ||
                      "Upload / Replace"}
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
              );
            })}
          </Grid>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "right",
              width: "100%",
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate(`/fieldOfficer/landEdit2/${landId}`)}
            >
              Back
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveNext}
              disabled={busy}
            >
              Save & Next
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LandEdit3;
