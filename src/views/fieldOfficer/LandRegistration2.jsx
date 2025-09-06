import { useState } from "react";
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
import FormStepper from "../components/FormStepper.jsx";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const LandRegistration2 = () => {
  const [file, setFile] = useState(null);

  const divisions = [
    { value: "North", label: "North" },
    { value: "South", label: "South" },
    { value: "East", label: "East" },
    { value: "West", label: "West" },
  ];

  const landUnits = [
    { value: "Acre", label: "Acre" },
    { value: "Hectare", label: "Hectare" },
    { value: "Perch", label: "Perch" },
  ];

  const schema = yup.object({
    division: yup.string().required("Select a division"),
    address: yup.string().required("Address is required"),
    longitude: yup.string().required("Longitude is required"),
    latitude: yup.string().required("Latitude is required"),
    landSize: yup.string().required("Extent of land is required"),
    landUnit: yup.string().required("Unit is required"),
    date: yup.string().required("Date of registration is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      division: "",
      address: "",
      longitude: "",
      latitude: "",
      landSize: "",
      landUnit: "",
      date: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log({ ...data, file });
  };

  return (
    <Box sx={{ minHeight: "100vh", }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        {/* Header */}
        <Typography variant="h5" gutterBottom>
          Farmer and Land Registration
        </Typography>
        
         {/* Stepper */}
        <FormStepper activeStep={1} />

        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Link underline="hover" color="inherit" href="/">
            <HomeIcon
              sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }}
            />{" "}
            Home
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
          sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}
        >
          <Typography variant="h6" gutterBottom>
            Land Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {/* Division */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>Division :</InputLabel>
              <Controller
                name="division"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    size="small"
                    sx={{ flex: 1 }}
                    error={!!errors.division}
                    helperText={errors.division?.message || " "}
                  >
                    {divisions.map((d) => (
                      <MenuItem key={d.value} value={d.value}>
                        {d.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

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

            {/* Language */}
            <Grid size={{ xs: 12, md: 7 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>Language :</InputLabel>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    sx={{ flex: 1 }}
                    error={!!errors.language}
                    helperText={errors.language?.message || " "}
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
                    {landUnits.map((u) => (
                      <MenuItem key={u.value} value={u.value}>
                        {u.label}
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
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Button>
              {file && <Typography>{file.name}</Typography>}
            </Grid>

            {/* Back and Next buttons */}
            <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate("./fieldOfficer/LandRegistration")}>Back</Button>
              <Button variant="contained" type="submit" onClick={() => navigate("./fieldOfficer/LandRegistration3")}>
                Next
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default LandRegistration2;
