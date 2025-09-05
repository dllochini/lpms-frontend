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
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const LandRegistration = () => {
  const [file, setFile] = useState(null);

  const designations = [
    { value: "Mr.", label: "Mr." },
    { value: "Miss.", label: "Miss." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Rev", label: "Rev" },
  ];

  const schema = yup.object({
    designation: yup.string().required("Choose a designation"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    fullName: yup.string().required("Full name is required"),
    nic: yup.string().required("NIC / Passport No. is required"),
    address: yup.string().required("Address is required"),
    contactNo: yup
      .string()
      .matches(/^[0-9]{10}$/, "Invalid format. Must be 10 digits"),
    accountNo: yup.string().required("Account number is required"),
    bank: yup.string().required("Bank is required"),
    branch: yup.string().required("Branch is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      designation: "",
      firstName: "",
      lastName: "",
      fullName: "",
      nic: "",
      address: "",
      contactNo: "",
      accountNo: "",
      bank: "",
      branch: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log({ ...data, file });
  };

  return (
    <Box sx={{ minHeight: "100vh", margin: 0, backgroundColor: "#f9f9f9" }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        {/* Header */}
        <Typography variant="h5" gutterBottom>
          Farmer and Land Registration
        </Typography>

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
            Farmer Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {/* Farmer search */}
            <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 200 }}>
                Farmer already registered?
              </InputLabel>
              <TextField
                placeholder="Full Name or NIC/Passport"
                size="small"
                sx={{ flex: 1 }}
              />
              <Button variant="contained">Search</Button>
              
            </Grid>
                ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            {/* Designation */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>Designation :</InputLabel>
              <Controller
                name="designation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    size="small"
                    sx={{ flex: 1 }}
                    error={!!errors.designation}
                    helperText={errors.designation?.message || " "}
                  >
                    {designations.map((d) => (
                      <MenuItem key={d.value} value={d.value}>
                        {d.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

             <Grid container spacing={2}> 
            {/* First Name */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>First Name :</InputLabel>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    sx={{ flex: 1 }}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message || " "}
                  />
                )}
              />
            </Grid>

            {/* Last Name */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>Last Name :</InputLabel>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    sx={{ flex: 1 }}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message || " "}
                  />
                )}
              />
            </Grid>
            </Grid>

            {/* Full Name */}
            <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>Full Name :</InputLabel>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    sx={{ flex: 1 }}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message || " "}
                  />
                )}
              />
            </Grid>

            {/* NIC */}
            <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>
                NIC / Passport No. :
              </InputLabel>
              <Controller
                name="nic"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    sx={{ flex: 1 }}
                    error={!!errors.nic}
                    helperText={errors.nic?.message || " "}
                  />
                )}
              />
            </Grid>

            {/* File upload */}
            <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>
                Scanned Copy of NIC/Passport :
              </InputLabel>
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

            {/* Contact */}
            <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>Contact No :</InputLabel>
              <Controller
                name="contactNo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    sx={{ flex: 1 }}
                    error={!!errors.contactNo}
                    helperText={errors.contactNo?.message || " "}
                  />
                )}
              />
            </Grid>

            {/* Bank details */}
            <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 130 }}>Account No :</InputLabel>
              <Controller
                name="accountNo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    sx={{ flex: 1 }}
                    error={!!errors.accountNo}
                    helperText={errors.accountNo?.message || " "}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 60 }}>Bank :</InputLabel>
              <Controller
                name="bank"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    sx={{ flex: 1 }}
                    error={!!errors.bank}
                    helperText={errors.bank?.message || " "}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", gap: 1 }}>
              <InputLabel sx={{ minWidth: 60 }}>Branch :</InputLabel>
              <Controller
                name="branch"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    sx={{ flex: 1 }}
                    error={!!errors.branch}
                    helperText={errors.branch?.message || " "}
                  />
                )}
              />
            </Grid>

            {/* Next button */}
            <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" type="submit">
                Next
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default LandRegistration;


