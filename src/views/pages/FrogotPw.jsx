import React from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = (data) => {
    console.log("Reset password data:", data);
    // TODO: Call your reset password API here
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
              sx={{
                height: 60,
                width: "auto",
              }}
            />
          </Box>

          {/* Hello Message
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
            mt={1}
            mb={2}
            color="primary"
          >
            Hello Alex!
          </Typography> */}

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
                  variant="outlined"
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
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />

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
            >
              Submit
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
