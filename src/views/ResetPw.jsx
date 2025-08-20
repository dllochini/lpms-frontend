import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Link,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSearchParams } from "react-router-dom";
import bgImage from "/images/sugar-cane.jpg";
import companyLogo from "/images/ceylon-sugar-industries.png";
import { resetPassword } from "../api/auth";

// ✅ Validation schema
const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#^()\-_=+{}[\]|;:'",.<>/~`]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // <-- ✅ track success

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");

    console.log("token:", token);

    try {
      const response = await resetPassword(token, data.password);

      if (response.status === 200) {
        setSuccess(true); // ✅ indicate success
        setMessage("Password reset successful! Please log in again.");
        reset(); // Clear the form
      } else {
        setError(response.data?.message || "Something went wrong.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        maxWidth: "100vw",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: 6,
          backgroundColor: "rgba(255,255,255,0.95)",
        }}
      >
        <CardContent sx={{ px: 4, py: 4 }}>
          {/* Logo */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box
              component="img"
              src={companyLogo}
              alt="Company Logo"
              sx={{ height: 60, width: "auto" }}
            />
          </Box>

          {/* Success message OR form */}
          {success ? (
            <Alert severity="success" sx={{ mt: 1 }}>
              {message} <Link href="/login">Go to login</Link>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Enter New Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Retype Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.2,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <Typography
        variant="body2"
        color="white"
        sx={{ mt: 4, opacity: 0.8, textAlign: "center" }}
      >
        © 2025 Ceylon Sugar Industries – Land Preparation System. All Rights
        Reserved.
      </Typography>
    </Box>
  );
}
