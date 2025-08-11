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

const UserRegistration = () => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);

  //Fetch roles from API
  const fetchRoles = async function () {
    try {
      const response = await getRoles();
      console.log("Full Roles API response:", response);
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

  useEffect(() => {
    fetchRoles();
  }, []);

  const designations = [
    {
      value: "Mr.",
      label: "Mr.",
    },
    {
      value: "Miss.",
      label: "Miss.",
    },
    {
      value: "Mrs.",
      label: "Mrs.",
    },
    {
      value: "Rev",
      label: "Rev",
    },
  ];

  // Validation schema using Yup
  const schema = yup
    .object({
      designation: yup.string().required("Choose a designation"),
      role: yup.string().required("Choose a role"),
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
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
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
          /[@$!%*?&]/,
          "Password must contain at least one special character"
        ),
      confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      designation: "",
      role: "",
      firstName: "",
      lastName: "",
      fullName: "",
      email: "",
      nic: "",
      contact_no: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    setFormData(data); // save form data for confirmed submit
    setOpenConfirm(true); // open confirm dialog
  };

  const handleConfirmSubmit = async () => {
    setOpenConfirm(false);
    try {
      const response = await createUser(formData);
      // show success message
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
      <Box
        className="body"
        sx={{
          minHeight: "125vh",
          margin: 0,
        }}
      >
        <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
          {/* Header */}
          <Typography variant="h5" gutterBottom>
            New User Registration
          </Typography>

          {/* Breadcrumbs */}
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

        {/* form */}
        <Box
          component="form"
          sx={{
            // marginTop: 3,
            marginBottom: 3,
            justifyContent: "center",
            display: "flex",
          }}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          {/* Box for form content */}
          <Paper
            elevation={5}
            sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}
          >
            {/* form content  */}
            <Grid sx={{ margin: 3 }}>
              {/* designation */}
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  // border: 1,
                  // borderColor: "yellow",
                }}
              >
                <InputLabel
                  className="inputLabel"
                  sx={{ paddingBottom: 3, minWidth: 130 }}
                >
                  Designation :
                </InputLabel>
                <Controller
                  name="designation"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="outlined-select-designations"
                      select
                      // label="Designation"
                      size="small"
                      className="inputField"
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

              {/* role */}
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  // border: 1,
                  // borderColor: "yellow",
                }}
              >
                <InputLabel
                  className="inputLabel"
                  sx={{ paddingBottom: 3, minWidth: 130 }}
                >
                  Role :
                </InputLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="outlined-select-roles"
                      select
                      size="small"
                      className="inputField"
                      sx={{ width: 100 }}
                      error={!!errors.role}
                      helperText={errors.role?.message || " "}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role._id} value={role._id}>
                          {role.role}{" "}
                          {/* or role.label depending on your Role schema */}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              {/* first name and last name container */}
              <Grid
                sx={{
                  // border: 1,
                  // borderColor: "green",
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
              >
                {/* firstName */}
                <Grid
                  item
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    // border: 1,
                    // borderColor: "red",
                    // width: "50%",
                    marginRight: "3%",
                  }}
                >
                  <InputLabel
                    className="inputLabel"
                    sx={{ paddingBottom: 3, minWidth: 130 }}
                  >
                    First Name :
                  </InputLabel>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="outlined-required"
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message || " "}
                        size="small"
                        className="inputField"
                      />
                    )}
                  />
                </Grid>

                {/* lastName */}
                <Grid
                  item
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    // border: 1,
                    // borderColor: "red",
                    width: "50%",
                  }}
                >
                  <InputLabel
                    className="inputLabel"
                    sx={{ paddingBottom: 3, minWidth: 130 }}
                  >
                    Last Name :
                  </InputLabel>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="outlined-required"
                        size="small"
                        className="inputField"
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message || " "}
                        // fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Full name */}
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  // border: 1,
                  // borderColor: "yellow",
                }}
              >
                <InputLabel
                  className="inputLabel"
                  sx={{ paddingBottom: 3, minWidth: 130 }}
                >
                  Full Name :
                </InputLabel>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="outlined-required"
                      size="small"
                      // className="inputField"
                      sx={{ width: "400px" }}
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message || " "}
                    />
                  )}
                />
              </Grid>

              {/* NIC */}
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  // border: 1,
                  // borderColor: "yellow",
                }}
              >
                <InputLabel
                  className="inputLabel"
                  sx={{ paddingBottom: 3, minWidth: 130 }}
                >
                  NIC :
                </InputLabel>
                <Controller
                  name="nic"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="outlined-required"
                      size="small"
                      className="inputField"
                      sx={{ width: "400px" }}
                      error={!!errors.nic}
                      helperText={errors.nic?.message || " "}
                    />
                  )}
                />
              </Grid>

              {/* Email */}
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  // border: 1,
                  // borderColor: "yellow",
                }}
              >
                <InputLabel
                  className="inputLabel"
                  sx={{ paddingBottom: 3, minWidth: 130 }}
                >
                  Email :
                </InputLabel>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="outlined-required"
                      size="small"
                      className="inputField"
                      error={!!errors.email}
                      helperText={errors.email?.message || " "}
                    />
                  )}
                />
              </Grid>

              {/* Contact */}
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  // border: 1,
                  // borderColor: "yellow",
                }}
              >
                <InputLabel
                  className="inputLabel"
                  sx={{ paddingBottom: 3, minWidth: 130 }}
                >
                  Contact No :
                </InputLabel>
                <Controller
                  name="contact_no"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="outlined-required"
                      size="small"
                      className="inputField"
                      error={!!errors.contact_no}
                      helperText={errors.contact_no?.message || " "}
                    />
                  )}
                />
              </Grid>

              <Divider sx={{ mb: 2, p: 0 }} />

              {/* password and confirm password*/}
              <Grid
                sx={{
                  // border: 1,
                  // borderColor: "green",
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
              >
                {/* Password */}
                <Grid
                  item
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    // border: 1,
                    // borderColor: "red",
                    // width: "50%",
                    // marginRight: "2%"
                  }}
                >
                  <InputLabel
                    className="inputLabel"
                    sx={{ paddingBottom: 3, minWidth: 130 }}
                  >
                    New Password :
                  </InputLabel>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="outlined-required"
                        type="password"
                        error={!!errors.password}
                        helperText={errors.password?.message || " "}
                        size="small"
                        sx={{ width: 200 }}
                        className="inputField"
                      />
                    )}
                  />
                </Grid>

                {/* Confirm password */}
                <Grid
                  item
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    // border: 1,
                    // borderColor: "red",
                    // width: "50%",
                  }}
                >
                  <InputLabel
                    className="inputLabel"
                    sx={{ paddingBottom: 3, minWidth: 130 }}
                  >
                    Confirm New Password :
                  </InputLabel>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="password"
                        id="outlined-required"
                        size="small"
                        className="inputField"
                        sx={{ width: 200 }}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message || " "}
                        // fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ mb: 2, p: 0 }} />

              {/* 2 Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  // mt: 2,
                  gap: 2,
                }}
              >
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={() => reset()}
                >
                  Cancel
                </Button>

                <Button
                  type="submit" // prevent immediate submit
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Paper>
        </Box>
      </Box>

      <Dialog
        sx={{ p: 2 }}
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
      >
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
