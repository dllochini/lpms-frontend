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

const documentFields = [
  { name: "titleDeed", label: "Title Deed* (Ownership Deed)" },
  { name: "extract", label: "Extract (Bim Saha Lipi) from Land Registry (Certified Copy)*" },
  { name: "surveyPlan", label: "Survey Plan (Document of Licensed Surveyor’s Plan)*" },
  { name: "taxReceipts", label: "Tax Receipts & Assessment Extracts*" },
  { name: "streetLine", label: "Street Line / Building Line*" },
  { name: "certificate", label: "Certificate of Non-Vesting*" },
  { name: "zoning", label: "Development / Zoning Certificates*" },
];

const LandRegistrationUpload = () => {
  const [files, setFiles] = useState({});

  const handleFileChange = (name, file) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Uploaded files:", files);
  };

  return (
    <Box sx={{ minHeight: "100vh", }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        {/* Header */}
        <Typography variant="h5" gutterBottom>
          Farmer and Land Registration
        </Typography>
        
         {/* Stepper */}
        <FormStepper activeStep={2} />

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
          sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}
        >
          <Typography variant="h6" gutterBottom>
            Document Upload
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2} direction="column" >
            {documentFields.map((doc) => (
              <Grid
                key={doc.name}
                item
                xs={12}
                sx={{ display: "flex", alignItems: "center", gap: 2}}

              >
                <Typography sx={{ minWidth: 280 }}>{doc.label}</Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                  sx={{ flex: 1, textAlign: "left" }}
                >
                  {files[doc.name]?.name || "Link or drag and drop"}
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
  control={<Checkbox />}
  label="All above approved by Legal Officer"
/>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined">Back</Button>
              <Button variant="contained" type="submit">
                Next
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LandRegistrationUpload;
