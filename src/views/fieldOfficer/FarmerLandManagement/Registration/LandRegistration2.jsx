import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputLabel,
  Button,
  Typography,
  Grid,
  Paper,
  MenuItem,
  Breadcrumbs,
  Link,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FormStepper from "../CreateLandFormStepper.jsx";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getUnits } from "../../../../api/unit.js";
import * as yup from "yup";
import { setWithExpiry, getWithExpiry } from "../../../../utils/localStorageHelpers.js";
import { saveFile, getAllFiles } from "../../../../utils/db.js";
import { getUserById } from "../../../../api/user.js";

const FILE_KEY = "landRegForm2_file";

const LandRegistration2 = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [landUnits, setLandUnits] = useState([]);

  const schema = yup.object({
    address: yup.string().required("Address is required"),
    landSize: yup
      .number()
      .typeError("Enter a valid number")
      .required("Extent of land is required"),
    landUnit: yup.string().required("Unit is required"),
    date: yup.string().required("Date of registration is required"),
  });

  const savedWrapper = getWithExpiry("landRegForm2") || null;

  const fetchData = async () => {
    try {
      const resUnits = await getUnits();
      setLandUnits(
        Array.isArray(resUnits.data)
          ? resUnits.data
          : resUnits.data?.landUnits || []
      );
    } catch (err) {
      console.error("Error fetching units:", err);
      setLandUnits([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = async (fileObj) => {
    if (!fileObj) return;
    setFile(fileObj);

    try {
      if (typeof saveFile === "function") {
        await saveFile(FILE_KEY, fileObj);
      }

      const existing = getWithExpiry("landRegForm2") || {};
      setWithExpiry(
        "landRegForm2",
        { ...(existing || {}), data: existing.data || {}, fileKey: FILE_KEY },
        30 * 60 * 1000
      );
    } catch (err) {
      console.error("Failed to save file to IndexedDB:", err);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: savedWrapper?.data || {
      address: "",
      landSize: "",
      landUnit: "",
      date: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const loadFile = async () => {
      try {
        const stored = getWithExpiry("landRegForm2");
        const key = stored?.fileKey || null;
        if (!key) return;
        if (typeof getAllFiles === "function") {
          const files = await getAllFiles();
          if (files && files[key]) setFile(files[key]);
        }
      } catch (err) {
        console.error("Failed to load file from indexedDB:", err);
      }
    };
    loadFile();
  }, []);

  const onSubmit = async (data) => {
    try {
      const selectedUnit = landUnits.find((u) => u._id === data.landUnit);

      if (!selectedUnit) {
        console.error("Invalid unit");
        return;
      }

      const loggedUserId = localStorage.getItem("loggedUserId") || "";
      if (!loggedUserId) {
        console.error("No logged user ID found");
        return;
      }

      const user = await getUserById(loggedUserId);
      const divisionId = user?.data?.division?._id;

      const payload = {
        ...data,
        landUnit: selectedUnit._id,
        size: selectedUnit.size,
        division: divisionId,
      };
      const fileKey = file ? "land_image" : null;
      if (file) {
        await saveFile(fileKey, file);
      }

      setWithExpiry("landRegForm2", { payload, fileKey }, 60 * 60 * 1000);

      navigate("/fieldOfficer/landRegistration3");
    } catch (err) {
      console.error("Failed to save land details:", err);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Farmer and Land Registration
        </Typography>

        <FormStepper activeStep={1} />

        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Link underline="hover" color="inherit" href="/fieldOfficer/landRegistry">
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />{" "}
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/fieldOfficer/landRegistry" >
            Land Registry
            </Link>
          <Typography color="text.primary">Add New Farmer & Land</Typography>
        </Breadcrumbs>
      </Box>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", justifyContent: "center", mb: 3 }}
      >
        <Paper
          elevation={5}
          sx={{ maxWidth: "70%", mx: "auto", px: 10, py: 5, borderRadius: 5 }}
        >
          <Typography variant="h6" gutterBottom>
            Land Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>

            {/* Address */}
            <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>Address :</InputLabel>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    sx={{ flex: 1 }}
                    error={!!errors.address}
                    helperText={errors.address?.message || " "}
                  />
                )}
              />
            </Grid>

            {/* Land Size + Unit */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>Extent of Land :</InputLabel>
              <Controller
                name="landSize"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    type="number"
                    sx={{ flex: 1 }}
                    error={!!errors.landSize}
                    helperText={errors.landSize?.message || " "}
                  />
                )}
              />
              <Controller
                name="landUnit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    size="small"
                    sx={{ width: 120 }}
                    error={!!errors.landUnit}
                    helperText={errors.landUnit?.message || " "}
                  >
                    {landUnits
                      .filter((unit) => unit.category === "area")
                      .map((unit) => (
                        <MenuItem key={unit._id} value={unit._id}>
                          {unit.name}
                        </MenuItem>
                      ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Date */}
            <Grid size={{ xs: 12, md: 7 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>
                Date of Registration :
              </InputLabel>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    size="small"
                    sx={{ flex: 1 }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.date}
                    helperText={errors.date?.message || " "}
                  />
                )}
              />
            </Grid>

            {/* File upload */}
            <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>Image :</InputLabel>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
              >
                Upload File
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files[0];
                    await handleFileChange(f);
                  }}
                />
              </Button>
              {file && <Typography>{file.name}</Typography>}
            </Grid>

            {/* Back and Next buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "right",
                width: "100%",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate("/fieldOfficer/landRegistration1")}
              >
                Back
              </Button>

              <Button variant="contained" type="submit">
                Next
              </Button>
            </Box>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};


export default LandRegistration2;
