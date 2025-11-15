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
  Autocomplete,
  Link,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FormStepper from "../../../components/fieldOfficer/CreateLandFormStepper.jsx";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getUserById, getUsers } from "../../../api/user.js";

// Use your helpers
import {
  getWithExpiry,
  setWithExpiry,
} from "../../../utils/localStorageHelpers.js";
import { saveFile, getAllFiles, deleteFile } from "../../../utils/db.js"; // matches your db.js

const FILE_KEY = "landRegForm1_file";

const LandRegistration1 = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [farmersLoading, setFarmersLoading] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const designations = [
    { value: "Mr.", label: "Mr." },
    { value: "Miss.", label: "Miss." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Rev", label: "Rev" },
  ];

  // Validation schema
  const schema = yup.object({
    designation: yup.string().required("Choose a designation"),
    fullName: yup.string().required("Full name is required"),
    nic: yup.string().required("NIC / Passport No. is required"),
    address: yup.string().required("Address is required"),
    contactNo: yup
      .string()
      .matches(/^[0-9]{10}$/, "Invalid format. Must be 10 digits")
      .required("Contact no. is required"),
    accountNo: yup.string().required("Account number is required"),
    bank: yup.string().required("Bank is required"),
    branch: yup.string().required("Branch is required"),
  });

  // Use saved values if present (note: this must remain synchronous for useForm)
  const savedForm = getWithExpiry("landRegForm1") || null;

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: savedForm?.data || {
      designation: "",
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

  useEffect(() => {
    const stored = getWithExpiry("landRegForm1");
    if (!stored) {
      // clear react-hook-form state
      reset({
        designation: "",
        fullName: "",
        nic: "",
        address: "",
        contactNo: "",
        accountNo: "",
        bank: "",
        branch: "",
      });
      // clear uploaded file preview in UI
      setFile(null);

      // optionally delete the stored indexedDB file key to be safe
      // (no need to await, it's best-effort)
      if (typeof deleteFile === "function") {
        deleteFile(FILE_KEY).catch(() => {
          /* ignore */
        });
      }
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Load previously uploaded file from IndexedDB (async) using getAllFiles()
  useEffect(() => {
    let mounted = true;
    const loadFile = async () => {
      try {
        const stored = getWithExpiry("landRegForm1");
        const desiredKey = stored?.fileKey || FILE_KEY;
        if (typeof getAllFiles === "function") {
          const files = await getAllFiles(); // returns an object { key: file }
          const f = files[desiredKey] || files[FILE_KEY] || null;
          if (mounted && f) setFile(f);
        }
      } catch (err) {
        console.error("Failed to load file from indexedDB:", err);
      }
    };
    loadFile();
    return () => (mounted = false);
  }, []);

  // If localStorage snapshot was removed, clear form + file state

  // Fetch farmers
  useEffect(() => {
    let canceled = false;
    const fetchFarmers = async () => {
      setFarmersLoading(true);
      try {
        const res = await getUsers();
        if (!canceled) setFarmers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load farmers:", err);
      } finally {
        if (!canceled) setFarmersLoading(false);
      }
    };
    fetchFarmers();
    return () => (canceled = true);
  }, []);

  // Handle farmer search
  const handleSearchFarmer = async () => {
    if (!selectedFarmer?._id) return;
    try {
      const res = await getUserById(selectedFarmer._id);
      const farmerData = res.data || {};
      const fields = [
        "designation",
        "fullName",
        "nic",
        "address",
        "contactNo",
        "accountNo",
        "bank",
        "branch",
      ];
      fields.forEach((f) => setValue(f, farmerData[f] ?? ""));

      // Persist into your localStorage helper. We store the form data under a single key
      // and keep the file in IndexedDB (referenced by fileKey) to avoid serializing binaries.
      setWithExpiry(
        "landRegForm1",
        {
          data: {
            ...fields.reduce(
              (acc, k) => ({ ...acc, [k]: farmerData[k] ?? "" }),
              {}
            ),
          },
          fileKey: file ? FILE_KEY : undefined,
        },
        30 * 60 * 1000
      );
    } catch (err) {
      console.error("Error fetching farmer:", err);
    }
  };

  // Save file to IndexedDB helper (and update local state + localStorage reference)
  const handleFileChange = async (fileObj) => {
    if (!fileObj) return;
    setFile(fileObj);
    try {
      if (typeof saveFile === "function") {
        await saveFile(FILE_KEY, fileObj);
      } else {
        console.warn(
          "indexedDb.saveFile not available; file will not persist across reloads"
        );
      }

      // Update the stored form reference (preserve existing data if any)
      const existing = getWithExpiry("landRegForm1") || {};
      setWithExpiry(
        "landRegForm1",
        { ...(existing || {}), data: existing.data || {}, fileKey: FILE_KEY },
        30 * 60 * 1000
      );
    } catch (err) {
      console.error("Failed to save file to indexedDB:", err);
    }
  };

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      if (file && typeof saveFile === "function") {
        await saveFile(FILE_KEY, file);
      }

      setWithExpiry(
        "landRegForm1",
        { data, fileKey: file ? FILE_KEY : undefined },
        30 * 60 * 1000
      );

      // Clear file from IndexedDB after submission
      // if (typeof deleteFile === "function") {
      //   await deleteFile(FILE_KEY);
      // }

      navigate("/fieldOfficer/landRegistration2");
    } catch (err) {
      console.error("Error on submit:", err);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", margin: 0 }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Farmer and Land Registration
        </Typography>

        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <Link underline="hover" color="inherit" href="/fieldOfficer">
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />{" "}
            Home
          </Link>
          <Typography color="text.primary">Add New Farmer & Land</Typography>
        </Breadcrumbs>

        <Box sx={{ mt: 4 }}>
          <FormStepper activeStep={0} />
        </Box>
      </Box>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
          direction: "column",
        }}
      >
        <Paper
          elevation={5}
          sx={{ maxWidth: "70%", mx: "auto", px: 10, py: 5, borderRadius: 5 }}
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
              <Autocomplete
                sx={{ flex: 1 }}
                options={farmers}
                getOptionLabel={(option) =>
                  option?.fullName
                    ? `${option.fullName} — ${option.nic || ""}`
                    : ""
                }
                loading={farmersLoading}
                isOptionEqualToValue={(opt, val) => opt._id === val._id}
                onChange={(_, selected) => setSelectedFarmer(selected)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Search by name or NIC"
                  />
                )}
              />
              <Button
                variant="contained"
                disabled={!selectedFarmer}
                onClick={handleSearchFarmer}
              >
                Search
              </Button>
            </Grid>

            <Divider sx={{ width: "100%", mb: 2 }} />

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
                sx={{ flex: 1 }}
              >
                {file?.name || "Upload File"}
                <input
                  type="file"
                  hidden
                  accept="image/*,.pdf"
                  onChange={async (e) => {
                    const f = e.target.files && e.target.files[0];
                    await handleFileChange(f);
                  }}
                />
              </Button>
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
            <Grid
              size={{ xs: 12 }}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
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

export default LandRegistration1;
