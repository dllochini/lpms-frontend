// src/pages/ResetPw.jsx
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

// Validation schema (fixed regex; escaped slash & backslash)
const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*()_\-+=\[\]{};:'",.<>\/\\?|`~]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

// Local error mapper — no external utils file needed
function getFriendlyErrorMessage(serverError, fallback = "Something went wrong. Please try again.") {
  if (!serverError) return fallback;
  const msg = String(serverError || "").toLowerCase();

  // Email service / SMTP temporary failure -> friendly message
  if (msg.includes("gsmtp") || msg.includes("421") || msg.includes("smtp") || msg.includes("email")) {
    return "We couldn't send or process the request right now. Please try again in a few minutes.";
  }

  // Token expired / invalid
  if (msg.includes("invalid or expired token") || msg.includes("invalid token") || msg.includes("expired token")) {
    return "The password reset link is invalid or has expired. Request a new link.";
  }

  // User not found / do not leak user existence
  if (msg.includes("user not found") || msg.includes("no user")) {
    return "If an account exists for that email, a reset link has been sent.";
  }

  // If server provided a short, safe message show it
  if (msg.length > 0 && msg.length < 200) return serverError;

  return fallback;
}

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
    defaultValues: { password: "", confirmPassword: "" },
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const extractServerMessage = (err) => {
    return err?.response?.data?.error || err?.response?.data?.message || err?.message || null;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");

    // Frontend token sanity check
    if (!token) {
      setLoading(false);
      setError("Reset token missing. Please use the link from your email.");
      if (process.env.NODE_ENV === "development") console.error("Reset token missing in URL (searchParams).");
      return;
    }

    if (!data.password) {
      setLoading(false);
      setError("Please enter a new password.");
      return;
    }

    try {
      if (process.env.NODE_ENV === "development") console.log("Submitting reset with token:", token);

      const response = await resetPassword(token, data.password);

      if (response?.status === 200 || response?.status === 204) {
        setSuccess(true);
        setMessage(response.data?.message || "Password reset successful! Please log in again.");
        reset();
      } else {
        const serverMsg = response?.data?.message || response?.data?.error || "Something went wrong.";
        setError(getFriendlyErrorMessage(serverMsg));
      }
    } catch (err) {
      // Log full error only in dev
      if (process.env.NODE_ENV === "development") console.error("resetPassword error (full):", err);

      const serverMsg = extractServerMessage(err);
      setError(getFriendlyErrorMessage(serverMsg));
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
            <Box component="img" src={companyLogo} alt="Company Logo" sx={{ height: 60, width: "auto" }} />
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <Typography variant="body2" color="white" sx={{ mt: 4, opacity: 0.8, textAlign: "center" }}>
        © 2025 Ceylon Sugar Industries – Land Preparation System. All Rights Reserved.
      </Typography>
    </Box>
  );
}
