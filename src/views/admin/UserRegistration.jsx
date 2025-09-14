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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import HomeIcon from "@mui/icons-material/Home";
import { createUser } from "../../api/user";
import { useNavigate } from "react-router-dom";
import { getRoles } from "../../api/role";
import { getDivisions } from "../../api/division";

const UserRegistration = () => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [divisions, setDivisions] = useState([]);

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(
        Array.isArray(response.data)
          ? response.data
          : response.data?.roles || []
      );
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
    }
  };

  // Fetch divisions
  const fetchDivisions = async () => {
    try {
      const response = await getDivisions();
      setDivisions(
        Array.isArray(response.data)
          ? response.data
          : response.data?.divisions || []
      );
    } catch (error) {
      console.error("Error fetching divisions:", error);
      setDivisions([]);
    }
  };

  useEffect(() => {
    fetchDivisions();
    fetchRoles();
  }, []);

  const designations = [
    { value: "Mr.", label: "Mr." },
    { value: "Miss.", label: "Miss." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Rev", label: "Rev" },
  ];

  // Yup schema
  const schema = yup.object({
    designation: yup.string().required("Choose a designation"),
    role: yup.string().required("Choose a role"),
    division: yup
      .string()
      .test("division-required", "Choose a division", function (value) {
        const { role } = this.parent; // get role from form
        // get role object safely
        const selectedRole = roles.find((r) => r._id === role);
        if (!selectedRole) return true; // no role yet → don’t validate
        if (["Admin", "Higher Management"].includes(selectedRole.name)) {
          return true; // division not required
        }
        return !!value; // must be filled
      }),
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email(),
    nic: yup
      .string()
      .matches(
        /^([0-9]{9}[vV]|[0-9]{12})$/,
        "Invalid NIC format. Must be 12 digits or 9 digits with 'V'/'v'"
      ),
    contact_no: yup
      .string()
      .matches(/^[0-9]{10}$/, "Invalid format. Must be 10 digits"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "At least one lowercase letter")
      .matches(/[A-Z]/, "At least one uppercase letter")
      .matches(/[0-9]/, "At least one number")
      .matches(/[@$!%*?&]/, "At least one special character"),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      designation: "",
      role: "",
      division: "",
      fullName: "",
      email: "",
      nic: "",
      contact_no: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const selectedRoleId = watch("role");
  const selectedRoleObj = roles.find((r) => r._id === selectedRoleId);
  const showDivision =
    selectedRoleObj &&
    !["Admin", "Higher Management"].includes(selectedRoleObj.name);

  // Form submit (open confirmation)
  const onSubmit = (data) => {
    setFormData(data);
    setOpenConfirm(true);
  };

  // Confirmed submit
  const handleConfirmSubmit = async () => {
    setOpenConfirm(false);
    try {
      const response = await createUser(formData);
      setOpenSnackbar(true);
      reset();
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    } catch (error) {
      setSubmitError(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <>
      <Box sx={{ minHeight: "125vh", margin: 0 }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
          <Typography variant="h5" gutterBottom>
            New User Registration
          </Typography>

          <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
            <Link underline="hover" color="inherit" href="/admin/dashboard">
              <HomeIcon
                sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }}
              />{" "}
              Home
            </Link>
            <Typography color="text.primary">Add New User</Typography>
          </Breadcrumbs>
        </Box>

        {/* Form */}
        <Box
          component="form"
          sx={{ marginBottom: 3, justifyContent: "center", display: "flex" }}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <Paper
            elevation={5}
            sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}
          >
            <Grid sx={{ margin: 3 }}>
              {/* Designation */}
              <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>
                  Designation :
                </InputLabel>
                <Controller
                  name="designation"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      size="small"
                      sx={{ width: 100 }}
                      error={!!errors.designation}
                      helperText={errors.designation?.message || " "}
                    >
                      {designations.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              {/* Role */}
              <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>
                  Role :
                </InputLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      size="small"
                      sx={{ width: 200 }}
                      error={!!errors.role}
                      helperText={errors.role?.message || " "}
                    >
                      {roles
                        .filter((role) => role.name?.toLowerCase() !== "farmer")
                        .map((role) => (
                          <MenuItem key={role._id} value={role._id}>
                            {role.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  )}
                />
              </Grid>

              {/* Division */}
              {showDivision && (
                <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>
                    Division:
                  </InputLabel>
                  <Controller
                    name="division"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        size="small"
                        sx={{ width: 200 }}
                        error={!!errors.division}
                        helperText={errors.division?.message || " "}
                      >
                        {divisions.map((division) => (
                          <MenuItem key={division._id} value={division._id}>
                            {division.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              )}

              {/* Full name */}
              <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>
                  Full Name :
                </InputLabel>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      sx={{ width: "400px" }}
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message || " "}
                    />
                  )}
                />
              </Grid>

              {/* NIC */}
              <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>
                  NIC :
                </InputLabel>
                <Controller
                  name="nic"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      sx={{ width: "400px" }}
                      error={!!errors.nic}
                      helperText={errors.nic?.message || " "}
                    />
                  )}
                />
              </Grid>

              {/* Email */}
              <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>
                  Email :
                </InputLabel>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      error={!!errors.email}
                      helperText={errors.email?.message || " "}
                    />
                  )}
                />
              </Grid>

              {/* Contact */}
              <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>
                  Contact No :
                </InputLabel>
                <Controller
                  name="contact_no"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      error={!!errors.contact_no}
                      helperText={errors.contact_no?.message || " "}
                    />
                  )}
                />
              </Grid>

              <Divider sx={{ mb: 2 }} />

              {/* Passwords */}
              <Grid sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Grid
                  item
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>
                    New Password :
                  </InputLabel>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="password"
                        size="small"
                        sx={{ width: 200 }}
                        error={!!errors.password}
                        helperText={errors.password?.message || " "}
                      />
                    )}
                  />
                </Grid>

                <Grid
                  item
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>
                    Confirm New Password :
                  </InputLabel>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="password"
                        size="small"
                        sx={{ width: 200 }}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message || " "}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ mb: 2 }} />

              {/* Buttons */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={() => reset()}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Box>
            </Grid>
          </Paper>
        </Box>
      </Box>

      {/* Confirm Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>Are you sure you want to submit the form?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmSubmit}
            color="primary"
            variant="contained"
          >
            Yes, Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          Submission successful! Redirecting...
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

export default UserRegistration;
