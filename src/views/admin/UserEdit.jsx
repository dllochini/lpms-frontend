import { useState, useEffect, useMemo } from "react";
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
import HomeIcon from "@mui/icons-material/Home";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUserById } from "../../api/user";
import { getRoles } from "../../api/role";
import { getDivisions } from "../../api/division";

const designations = [
  { value: "Mr.", label: "Mr." },
  { value: "Mrs.", label: "Mrs." },
  { value: "Miss.", label: "Miss." },
  { value: "Ms.", label: "Ms." },
  { value: "Dr.", label: "Dr." },
  { value: "Prof.", label: "Prof." },
  { value: "Mx.", label: "Mx." },
  { value: "Rev.", label: "Rev." },
];

const UserEdit = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [roles, setRoles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [initialValues, setInitialValues] = useState(null); // for reset on cancel

  const fetchRoles = async function () {
    try {
      const response = await getRoles();
      setRoles(
        Array.isArray(response.data) ? response.data : response.data?.roles || []
      );
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
    }
  };

  const fetchDivisions = async function () {
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

  // Build schema with access to roles (so we can compare role _id values)
  const schema = useMemo(() => {
    return yup.object().shape({
      fullName: yup.string().required("Full name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      role: yup.string().required("Role is required"),
      division: yup.string().when("role", (roleId, schema) => {
        // if no role selected yet, skip requirement (validation will run when role exists)
        if (!roleId) return schema.notRequired();

        const adminId = roles.find((r) => r.name === "Admin")?._id;
        const higherManagerId =
          roles.find((r) => r.name === "Higher Management" || r.name === "Higher Manager")?._id;

        if (roleId === adminId || roleId === higherManagerId) {
          return schema.notRequired();
        }
        return schema.required("Division is required");
      }),
      designation: yup.string().required("Choose a designation"),
      nic: yup
        .string()
        .matches(
          /^([0-9]{9}[vV]|[0-9]{12})$/,
          "Invalid NIC format. Must be 12 digits or 9 digits with 'V'/'v'"
        )
        .nullable()
        .notRequired(),
      contact_no: yup
        .string()
        .matches(/^[0-9]{10}$/, "Invalid format. Must be 10 digits")
        .nullable()
        .notRequired(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    // we don't pass defaultValues here; they'll be set by reset(...) once user data loads
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for id:", userId);
        const userResponse = await getUserById(userId);
        const user = userResponse.data;
        console.log("User data fetched:", user);
        setSelectedUserName(user ? user.fullName : "");

        const initial = {
          designation: user.designation || "",
          role:
            typeof user.role === "object" && user.role !== null
              ? user.role._id
              : user.role || "",
          division:
            typeof user.division === "object" && user.division !== null
              ? user.division._id
              : user.division || "",
          fullName: user.fullName || "",
          email: user.email || "",
          nic: user.nic || "",
          contact_no: user.contact_no || "",
        };

        setInitialValues(initial);
        reset(initial); // set form values
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setSubmitError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      setLoading(false);
      setSubmitError("User ID is missing.");
    }
  }, [userId, reset]);

  const selectedRole = watch("role");
  const selectedRoleName = roles.find((r) => r._id === selectedRole)?.name;
  const showDivision =
    selectedRoleName &&
    !["Admin", "Higher Management", "Higher Manager"].includes(selectedRoleName);

  const onSubmit = (data) => {
    setFormData(data);
    setOpenConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setOpenConfirm(false);
    try {
      await updateUserById(userId, formData);
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (error) {
      setSubmitError(error.response?.data?.error || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">Loading user data...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ minHeight: "125vh", margin: 0 }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Edit User, <strong>{selectedUserName}</strong>
          </Typography>

          <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
            <Link underline="hover" color="inherit" href="/admin/dashboard">
              <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />{" "}
              Home
            </Link>
            <Typography color="text.primary">Edit User</Typography>
          </Breadcrumbs>
        </Box>

        <Box
          component="form"
          sx={{ marginBottom: 3, justifyContent: "center", display: "flex" }}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <Paper elevation={5} sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}>
            <Grid sx={{ margin: 3 }}>
              {/* Designation */}
              <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>Designation :</InputLabel>
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
                <InputLabel className="inputLabel" sx={{ paddingBottom: 3, minWidth: 130 }}>
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
                      {roles.map((role) => (
                        <MenuItem key={role._id} value={role._id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              {/* Division (conditional) */}
              {showDivision && (
                <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>Division:</InputLabel>
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

              {/* Full Name */}
              <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>Full Name :</InputLabel>
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
                <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>NIC :</InputLabel>
                <Controller
                  name="nic"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} size="small" sx={{ width: "400px" }} error={!!errors.nic} helperText={errors.nic?.message || " "} />
                  )}
                />
              </Grid>

              {/* Email */}
              <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>Email :</InputLabel>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} size="small" error={!!errors.email} helperText={errors.email?.message || " "} />
                  )}
                />
              </Grid>

              {/* Contact No */}
              <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InputLabel sx={{ paddingBottom: 3, minWidth: 130 }}>Contact No :</InputLabel>
                <Controller
                  name="contact_no"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} size="small" error={!!errors.contact_no} helperText={errors.contact_no?.message || " "} />
                  )}
                />
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={() => reset(initialValues || {})}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => setSubmitError("")}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Paper>
        </Box>
      </Box>

      {/* Confirm Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          Are you sure you want to save the changes for <strong>{selectedUserName}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmSubmit} color="primary" variant="contained">
            Yes, Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          User updated successfully! Redirecting...
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar open={!!submitError} autoHideDuration={4000} onClose={() => setSubmitError("")} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" onClose={() => setSubmitError("")}>
          {submitError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserEdit;
