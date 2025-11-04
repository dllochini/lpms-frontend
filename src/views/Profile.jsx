// views/Profile.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Breadcrumbs,
  Snackbar,
  Alert,
  Link as MuiLink,
  Link,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getUserById, updateUserById } from "../api/user";
import { getRoles } from "../api/role";
import { getDivisions } from "../api/division";
import { redirectByRole } from "../utils/redirectByRole";
import { forgotPassword } from "../api/auth";

const designations = [
  "Mr.",
  "Mrs.",
  "Miss.",
  "Ms.",
  "Dr.",
  "Prof.",
  "Mx.",
  "Rev.",
];

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState({});
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChangePassword = async () => {
    try {
      const sendData = {
        data: {
          email: formState.email,
          identifier: "Profile",
        },
      };

      const response = await forgotPassword(sendData);
      const { message, resetLink } = response.data;

      if (resetLink?.startsWith("http")) {
        window.open(resetLink, "_blank");
      }

      showSnackbar(message, "success");
    } catch (err) {
      console.error("Failed to request password reset:", err);
      showSnackbar("Failed to generate reset link.", "error");
    }
  };

  const handleSave = async () => {
    try {
      const updatePayload = { ...formState };
      delete updatePayload._id;
      delete updatePayload.fullName;

      await updateUserById(userData._id, updatePayload);

      const updatedRoleObj = roles.find((r) => r._id === updatePayload.role);

      setUserData({
        ...userData,
        ...updatePayload,
        role: updatedRoleObj || userData.role,
      });

      setRole(userData.role?.name);

      setEditMode(false);
      showSnackbar("Profile updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to update profile.", "error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loggedUserId = localStorage.getItem("loggedUserId");
        const [userRes, rolesRes, divisionsRes] = await Promise.all([
          getUserById(loggedUserId),
          getRoles(),
          getDivisions(),
        ]);
        const user = userRes.data;
        setUserData(user);
        setFormState({
          ...user,
          role: user.role?._id || "",
          division: user.division?._id || "",
          designation: user.designation || "",
        });
        setRoles(rolesRes.data);
        setDivisions(divisionsRes.data);
        // setRole(user.role?.name || "");
      } catch (err) {
        console.error(err);
        showSnackbar("Failed to fetch profile data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const roleName = roles.find((r) => r._id === formState.role)?.name || "";

  const fieldsToDisplay = [
    { label: "User ID", value: userData?._id, editable: false },
    { label: "Full Name", value: userData?.fullName, editable: false },
    {
      label: "Role",
      value: formState.role,
      editable: false,
      field: "role",
      type: "select",
      options: roles,
      displayKey: "name",
    },
    {
      label: "Division",
      value: formState.division,
      editable: true,
      field: "division",
      type: "select",
      options: divisions,
      displayKey: "name",
      hidden: ["Admin", "Higher Management"].includes(roleName),
    },
    {
      label: "Designation",
      value: formState.designation,
      editable: true,
      field: "designation",
      type: "select",
      options: designations.map((d) => ({ _id: d, name: d })),
      displayKey: "name",
    },
    { label: "Email", value: formState.email, editable: true, field: "email" },
    { label: "NIC", value: formState.nic, editable: true, field: "nic" },
    {
      label: "Contact No",
      value: formState.contact_no,
      editable: true,
      field: "contact_no",
    },
  ];

  const renderField = (field) => {
    if (editMode && field.editable) {
      if (field.type === "select") {
        return (
          <FormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formState[field.field] || ""}
              label={field.label}
              onChange={(e) =>
                setFormState({ ...formState, [field.field]: e.target.value })
              }
            >
              {field.options.map((opt) => (
                <MenuItem key={opt._id} value={opt._id}>
                  {opt[field.displayKey]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
      return (
        <TextField
          label={field.label}
          fullWidth
          type={field.type || "text"}
          value={formState[field.field] || ""}
          onChange={(e) =>
            setFormState({ ...formState, [field.field]: e.target.value })
          }
        />
      );
    }

    // Read-only mode
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 1,
          borderBottom: "1px solid #eee",
        }}
      >
        <Typography sx={{ fontWeight: 500 }}>{field.label}:</Typography>
        <Typography>
          {field.type === "select"
            ? field.options.find((opt) => opt._id === formState[field.field])?.[
                field.displayKey
              ] || "-"
            : field.value || "-"}
        </Typography>
      </Box>
    );
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Profile
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
          <MuiLink
            component={RouterLink}
            to={redirectByRole(roleName)}
            underline="hover"
            color="text.primary"
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />{" "}
            Home
          </MuiLink>
          <Typography color="text.primary">Profile</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        <Paper
          elevation={5}
          sx={{ maxWidth: 1100, mx: "auto", borderRadius: 5, p: 6 }}
        >
          <Grid container spacing={2} direction="column">
            {fieldsToDisplay
              .filter((f) => !f.hidden)
              .map((field, idx) => (
                <Grid item xs={12} key={idx}>
                  {renderField(field)}
                </Grid>
              ))}

            {/* Password row */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1,
                  borderBottom: "1px solid #eee",
                }}
              >
                <Typography sx={{ fontWeight: 500 }}>Password:</Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleChangePassword}
                  sx={{
                    textDecoration: "underline",
                    color: "primary.main",
                    cursor: "pointer",
                  }}
                >
                  Change Password
                </Link>
              </Box>
            </Grid>

            {/* Buttons */}
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                justifyContent: "flex-end",
              }}
            >
              {editMode ? (
                <>
                  <Button variant="contained" onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setFormState({
                        ...userData,
                        role: userData.role?._id || "",
                        division: userData.division?._id || "",
                        designation: userData.designation || "",
                      });
                      setEditMode(false);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={() => setEditMode(true)}>
                  Edit Profile
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* ✅ Single reusable Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;
