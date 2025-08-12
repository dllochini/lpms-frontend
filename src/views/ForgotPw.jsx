
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSearchParams } from "react-router-dom"; // <-- For token from URL
import bgImage from "/images/sugar-cane.jpg";
import companyLogo from "/images/ceylon-sugar-industries.png";

// ✅ Validation schema
const resetPasswordSchema = yup.object().shape({
  newPassword: yup.string().required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
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

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("https://your-api-url.com/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: data.newPassword,
          token: token, // Include token from URL
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(" Password reset successful!");
        reset();
      } else {
        setError(result.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter New Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
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

            {/* Message */}
            {message && (
              <Typography sx={{ mt: 1, color: "green", fontWeight: 500 }}>
                {message}
              </Typography>
            )}
            {error && (
              <Typography sx={{ mt: 1, color: "red", fontWeight: 500 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.2, fontWeight: "bold", textTransform: "uppercase" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <Typography
        variant="body2"
        color="white"
        sx={{ mt: 4, opacity: 0.8, textAlign: "center" }}
      >
        © 2025 Ceylon Sugar Industries – Land Preparation System. All Rights Reserved.
      </Typography>
    </Box>
  );
}
