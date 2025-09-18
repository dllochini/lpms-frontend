// views/Profile.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  Link,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUserById } from "../api/user";
import { getRoles } from "../api/role";
import { getDivisions } from "../api/division";

// Static designations (string values)
const designations = ["Mr.", "Mrs.", "Miss.", "Ms.", "Dr.", "Prof.", "Mx.", "Rev."];

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState({});
  const [roles, setRoles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const navigate = useNavigate();

  // Load user, roles, divisions
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
        // console.log("desgig", user.designation);

        setUserData(user);
        setFormState({
          ...user,
          role: user.role?._id || "",
          division: user.division?._id || "",
          designation: user.designation || "", // ✅ keep as string
        });
        setRoles(rolesRes.data);
        setDivisions(divisionsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setFormState({ ...formState, [field]: value });
  };

  const handleSave = async () => {
    try {
      const updatePayload = { ...formState };
      delete updatePayload._id;
      delete updatePayload.fullName;

      await updateUserById(userData._id, updatePayload);
      alert("Profile updated successfully!");
      setUserData({ ...userData, ...updatePayload });
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  const roleName = roles.find((r) => r._id === formState.role)?.name || "";

  const fieldsToDisplay = [
    { label: "User ID", value: userData._id, editable: false },
    { label: "Full Name", value: userData.fullName, editable: false },
    {
      label: "Role",
      value: formState.role,
      editable: true,
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
      value: userData.designation, // ✅ string value
      editable: true,
      field: "designation",
      type: "select",
      options: designations.map((d) => ({ _id: d, name: d })), // ✅ match value
      displayKey: "name",
    },
    { label: "Email", value: formState.email, editable: true, field: "email" },
    { label: "NIC", value: formState.nic, editable: true, field: "nic" },
    { label: "Contact No", value: formState.contact_no, editable: true, field: "contact_no" },
    { label: "Password", value: "********", editable: false, isPassword: true },
  ];

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Profile
        </Typography>

        <Grid container spacing={2} direction="column">
          {fieldsToDisplay
            .filter((f) => !f.hidden)
            .map((field, idx) => (
              <Grid item xs={12} key={idx}>
                {field.isPassword ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Typography sx={{ fontWeight: 500 }}>{field.label}:</Typography>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Change Password
                    </Link>
                  </Box>
                ) : editMode && field.editable ? (
                  field.type === "select" ? (
                    <FormControl fullWidth>
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        value={formState[field.field] || ""}
                        label={field.label}
                        onChange={(e) => handleChange(field.field, e.target.value)}
                      >
                        {field.options.map((opt) => (
                          <MenuItem key={opt._id} value={opt._id}>
                            {opt[field.displayKey]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      label={field.label}
                      fullWidth
                      type={field.type || "text"}
                      value={formState[field.field] || ""}
                      onChange={(e) => handleChange(field.field, e.target.value)}
                    />
                  )
                ) : (
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
                        ? field.field === "designation"
                          ? formState.designation || "-" // ✅ show string directly
                          : field.options.find((opt) => opt._id === formState[field.field])
                            ? field.options.find((opt) => opt._id === formState[field.field])[field.displayKey]
                            : "-"
                        : field.value || "-"}
                    </Typography>
                  </Box>
                )}
              </Grid>
            ))}

          <Grid item xs={12} sx={{ display: "flex", gap: 2, mt: 2 }}>
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
  );
};

export default Profile;
