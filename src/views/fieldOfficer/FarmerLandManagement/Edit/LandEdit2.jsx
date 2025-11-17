// File: LandEdit2.jsx
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
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getUnits } from "../../../../api/unit.js";
import { getLandById, updateLandById } from "../../../../api/land.js";
import {
  getWithExpiry,
  setWithExpiry,
} from "../../../../utils/localStorageHelpers.js";
import { saveFile, getAllFiles } from "../../../../utils/db.js";

const FILE_KEY = "landEdit2_file";

const LandEdit2 = () => {
  const navigate = useNavigate();
  const { landId } = useParams();

  const [file, setFile] = useState(null);
  const [units, setUnits] = useState([]);
  const [farmerName, setFarmerName] = useState("");

  const schema = yup.object({
    address: yup.string().required("Address is required"),
    size: yup
      .number()
      .typeError("Enter a valid number")
      .required("Extent of land is required"),
    unit: yup.string().required("Unit is required"),
  });

  const fetchData = async () => {

    try {
      const resUnits = await getUnits();
      setUnits(
        Array.isArray(resUnits.data)
          ? resUnits.data
          : resUnits.data?.units || []
      );
    } catch (err) {
      console.error("Error fetching units:", err);
      setUnits([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: "",
      size: "",
      unit: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!landId) return;
    let mounted = true;
    const loadLand = async () => {
      try {
        const res = await getLandById(landId);
        const landData = res?.data || {};
        if (mounted) {
          reset({
            address: landData.address || "",
            size: landData.size || "",
            unit: landData.unit?._id || "",
          });
          setFarmerName(landData.farmer?.fullName || "");
        }

        if (typeof getAllFiles === "function") {
          const files = await getAllFiles();
          if (files && files[FILE_KEY]) setFile(files[FILE_KEY]);
        }
      } catch (err) {
        console.error("Failed to load land data:", err);
      }
    };
    loadLand();
    return () => (mounted = false);
  }, [landId, reset]);

  const handleFileChange = async (fileObj) => {
    if (!fileObj) return;
    setFile(fileObj);

    try {
      await saveFile(FILE_KEY, fileObj);
      setWithExpiry(
        "landEdit2",
        { data: {}, fileKey: FILE_KEY },
        30 * 60 * 1000
      );
    } catch (err) {
      console.error("Failed to save file:", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      const selectedUnit = units.find((u) => u._id === data.unit);
      if (!selectedUnit) return;

      const payload = {
        ...data,
        unit: selectedUnit._id,
      };

      console.log("Submitting data:", payload);

      if (file) await saveFile(FILE_KEY, file);

      await updateLandById(landId, payload);
      setWithExpiry(
        "landEdit2",
        { data, fileKey: file ? FILE_KEY : null },
        30 * 60 * 1000
      );

      navigate(`/fieldOfficer/landEdit3/${landId}`);
    } catch (err) {
      console.error("Failed to update land:", err);
    }
  };

  const handleReset = () => {
    if (!landId) return;
    getLandById(landId).then((res) => {
      const landData = res?.data || {};
      reset({
        address: landData.address || "",
        size: landData.size || "",
        unit: landData.unit?._id || "",
      });
    });
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Edit Details – {farmerName} (Land ID: {landId})
        </Typography>

        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Link underline="hover" color="inherit" href="/fieldOfficer">
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />{" "}
            Home
          </Link>
          <Typography color="text.primary">Edit Farmer & Land</Typography>
        </Breadcrumbs>
        <Box sx={{ mt: 4 }}>
          <FormStepper activeStep={1} />
        </Box>
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
                name="size"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    type="number"
                    sx={{ flex: 1 }}
                    error={!!errors.size}
                    helperText={errors.size?.message || " "}
                  />
                )}
              />
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    size="small"
                    sx={{ width: 120 }}
                    error={!!errors.unit}
                    helperText={errors.unit?.message || " "}
                  >
                    {units
                      .filter((u) => u.category === "area")
                      .map((u) => (
                        <MenuItem key={u._id} value={u._id}>
                          {u.name}
                        </MenuItem>
                      ))}
                  </TextField>
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

            {/* Buttons */}
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
                onClick={() => navigate(`/fieldOfficer/landEdit1/${landId}`)}
              >
                Back
              </Button>
              <Button variant="outlined" onClick={handleReset}>
                Reset
              </Button>
              <Button variant="contained" type="submit">
                Save & Next
              </Button>
            </Box>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default LandEdit2;
