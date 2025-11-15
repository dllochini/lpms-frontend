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
import { useSearchParams } from "react-router-dom";
import bgImage from "/images/Wallpaper.jpg";
import companyLogo from "/images/CeylonSugarLogo.png";
import { resetPassword } from "../api/auth";
import resetPasswordSchema from "../validations/resetPasswordSchema.js"; 

// Local error mapper
function getFriendlyErrorMessage(
  serverError,
  fallback = "Something went wrong. Please try again."
) {
  if (!serverError) return fallback;
  const msg = String(serverError || "").toLowerCase();

  if (
    msg.includes("gsmtp") ||
    msg.includes("421") ||
    msg.includes("smtp") ||
    msg.includes("email")
  ) {
    return "We couldn't send or process the request right now. Please try again in a few minutes.";
  }

  if (
    msg.includes("invalid or expired token") ||
    msg.includes("invalid token") ||
    msg.includes("expired token")
  ) {
    return "The password reset link is invalid or has expired. Request a new link.";
  }

  if (msg.includes("user not found") || msg.includes("no user")) {
    return "If an account exists for that email, a reset link has been sent.";
  }

  if (msg.length > 0 && msg.length < 200) return serverError;

  return fallback;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const identifier = searchParams.get("identifier") || "Forgot"; // default

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema), // ✅ use imported schema
    defaultValues: { password: "", confirmPassword: "" },
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const extractServerMessage = (err) =>
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    null;

  // ResetPw.jsx -> onSubmit
  const onSubmit = async (data) => {
  setLoading(true);
  setError("");
  setMessage("");

  if (!token) {
    setError("Reset token missing. Please use the link from your email.");
    setLoading(false);
    return;
  }

  try {
    // Call API
    const loggedUserId = localStorage.getItem("loggedUserId") || null;

    console.log("Input for reset", token, data.password, identifier, loggedUserId);
    const response = await resetPassword(token, data.password, identifier, loggedUserId);

    setSuccess(true);
    setMessage(response.data?.message || "Password reset successful!");
    reset(); // clear form
  } catch (err) {
    setError(getFriendlyErrorMessage(err?.response?.data?.error));
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
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box
              component="img"
              src={companyLogo}
              alt="Company Logo"
              sx={{ height: 60, width: "auto" }}
            />
          </Box>

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
