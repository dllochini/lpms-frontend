import { useState, useEffect, useRef } from "react";
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
import { getUserById, updateUserById } from "../../../../api/user.js";
import { getLandById } from "../../../../api/land.js";

// Use your helpers
import {
  getWithExpiry,
  setWithExpiry,
} from "../../../../utils/localStorageHelpers.js";
import { saveFile, getAllFiles } from "../../../../utils/db.js"; // matches your db.js

const FILE_KEY = "landEditForm1_file";

const emptyDefaults = {
  designation: "",
  fullName: "",
  nic: "",
  address: "",
  contactNo: "",
  accountNo: "",
  bank: "",
  branch: "",
};

const LandEdit1 = () => {
  const navigate = useNavigate();
  const { landId } = useParams();

  const [farmerId, setFarmerId] = useState(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const savedForm = getWithExpiry("landEditForm1") || null;
  const initialValuesRef = useRef(savedForm?.data ?? null);
  const initialFileRef = useRef(null);
  const [farmerName, setFarmerName] = useState("");

  const designations = [
    { value: "Mr.", label: "Mr." },
    { value: "Miss.", label: "Miss." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Rev", label: "Rev" },
  ];

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

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: savedForm?.data || emptyDefaults,
    resolver: yupResolver(schema),
  });

  // --- fetch land to get farmerId ---
  useEffect(() => {
    let mounted = true;
    const fetchLandData = async () => {
      if (!landId) return;
      try {
        const response = await getLandById(landId);
        const foundFarmerId = response?.data?.farmer?._id;
        if (mounted && foundFarmerId) setFarmerId(foundFarmerId);
      } catch (error) {
        console.error("Error fetching land data:", error);
      }
    };
    fetchLandData();
    return () => (mounted = false);
  }, [landId]);

  // --- load farmer data ---
  useEffect(() => {
    if (!farmerId) return;
    let mounted = true;
    const loadFarmer = async () => {
      try {
        const res = await getUserById(farmerId);
        const farmerData = res?.data || {};
        const mapped = {
          designation: farmerData.designation ?? "",
          fullName: farmerData.fullName ?? "",
          nic: farmerData.nic ?? "",
          address: farmerData.address ?? "",
          contactNo: farmerData.contactNo ?? "",
          accountNo: farmerData.accountNo ?? "",
          bank: farmerData.bank ?? "",
          branch: farmerData.branch ?? "",
        };
        setFarmerName(farmerData.fullName || "");
        if (mounted) {
          if (!initialValuesRef.current) initialValuesRef.current = mapped;
          reset(mapped);
        }

        setWithExpiry(
          "landEditForm1",
          { data: mapped, fileKey: file ? FILE_KEY : undefined, farmerId },
          30 * 60 * 1000
        );
      } catch (err) {
        console.error("Failed to load farmer data:", err);
      }
    };
    loadFarmer();
    return () => (mounted = false);
  }, [farmerId, reset, file]);

  // --- load file from IndexedDB ---
  useEffect(() => {
    let mounted = true;
    const loadFile = async () => {
      try {
        const stored = getWithExpiry("landEditForm1");
        const desiredKey = stored?.fileKey || FILE_KEY;
        if (typeof getAllFiles === "function") {
          const files = await getAllFiles();
          const f = files[desiredKey] || files[FILE_KEY] || null;
          if (mounted && f) {
            setFile(f);
            if (!initialFileRef.current) initialFileRef.current = f;
          }
        }
      } catch (err) {
        console.error("Failed to load file from indexedDB:", err);
      }
    };
    loadFile();
    return () => (mounted = false);
  }, []);

  // --- protect snapshot & BFCache ---
  useEffect(() => {
    const ensureSnapshotMatches = () => {
      const stored = getWithExpiry("landEditForm1");
      if (stored?.farmerId && farmerId && stored.farmerId !== farmerId) {
        try {
          localStorage.removeItem("landEditForm1");
        } catch {}
        reset(initialValuesRef.current || emptyDefaults);
        setFile(initialFileRef.current || null);
      }
    };
    ensureSnapshotMatches();
    window.addEventListener("pageshow", ensureSnapshotMatches);
    window.addEventListener("popstate", ensureSnapshotMatches);
    return () => {
      window.removeEventListener("pageshow", ensureSnapshotMatches);
      window.removeEventListener("popstate", ensureSnapshotMatches);
    };
  }, [farmerId, reset]);

  // --- handle file upload ---
  const handleFileChange = async (fileObj) => {
    if (!fileObj) return;
    setFile(fileObj);
    try {
      if (typeof saveFile === "function") await saveFile(FILE_KEY, fileObj);

      const existing = getWithExpiry("landEditForm1") || {};
      setWithExpiry(
        "landEditForm1",
        {
          ...(existing || {}),
          data: existing.data || {},
          fileKey: FILE_KEY,
          farmerId: existing.farmerId || farmerId,
        },
        30 * 60 * 1000
      );

      if (!initialFileRef.current) initialFileRef.current = fileObj;
    } catch (err) {
      console.error("Failed to save file to indexedDB:", err);
    }
  };

  // --- SAVE & NEXT ---
  const handleSaveAndNext = handleSubmit(async (data) => {
    setBusy(true);
    try {
      if (file && typeof saveFile === "function")
        await saveFile(FILE_KEY, file);

      if (farmerId) {
        try {
          await updateUserById(farmerId, data);
        } catch (err) {
          console.error("Failed to update farmer on backend:", err);
        }
      }

      setWithExpiry(
        "landEditForm1",
        { data, fileKey: file ? FILE_KEY : undefined, farmerId },
        30 * 60 * 1000
      );

      navigate(`/fieldOfficer/landEdit2/${landId}`);
    } catch (err) {
      console.error("Error on Save & Next:", err);
    } finally {
      setBusy(false);
    }
  });

  const handleReset = async () => {
    reset(initialValuesRef.current || emptyDefaults);
    setFile(initialFileRef.current || null);

    try {
      setWithExpiry(
        "landEditForm1",
        {
          data: initialValuesRef.current || emptyDefaults,
          fileKey: initialFileRef.current ? FILE_KEY : undefined,
          farmerId: farmerId || undefined,
        },
        30 * 60 * 1000
      );
    } catch (err) {
      console.warn("Could not restore snapshot on reset:", err);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", margin: 0 }}>
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
          <FormStepper activeStep={0} />
        </Box>
      </Box>

      <Box
        component="form"
        noValidate
        autoComplete="off"
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

            {/* Buttons: Reset + Save & Next */}
            <Grid
              size={{ xs: 12 }}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button variant="outlined" onClick={handleReset} disabled={busy}>
                Reset
              </Button>

              <Button
                variant="contained"
                onClick={handleSaveAndNext}
                disabled={busy}
              >
                Save & Next
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default LandEdit1;
