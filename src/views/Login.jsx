import React, { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Link, Collapse,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import bgImage from "/images/sugar-cane.jpg";
import companyLogo from "/images/ceylon-sugar-industries.png";
import { loginUser, forgotPassword } from "../api/auth"; // Import your API functions


const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const forgotSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function LoginPage() {
  const [forgotOpen, setForgotOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    control: loginControl,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const {
    control: forgotControl,
    handleSubmit: handleForgot,
    formState: { errors: forgotErrors },
  } = useForm({ resolver: yupResolver(forgotSchema) });

  const onLogin = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await loginUser(data);
      const { token, role } = response.data;
  
      // Save token and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
  
      setSuccess("Login successful!");
  
      // Redirect user based on role
      if (role === "admin") {
        window.location.href = "/admin/dashboard";  // example admin dashboard URL
      } else if (role === "user") {
        window.location.href = "/user/dashboard";   // example user dashboard URL
      } else {
        window.location.href = "/"; // fallback
      }
  
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };
  

  const onForgot = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await forgotPassword(data);
      setSuccess("Password reset email sent!");
      console.log("Forgot password response:", response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    }
    setLoading(false);
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
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        overflow: "hidden",
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
        <CardContent sx={{ px: 4, pb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <Box
              component="img"
              src={companyLogo}
              alt="Company Logo"
              sx={{ height: 60, width: "auto" }}
            />
          </Box>

          {error && (
            <Typography color="error" textAlign="center" mb={1}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" textAlign="center" mb={1}>
              {success}
            </Typography>
          )}

          <form onSubmit={handleLogin(onLogin)}>
            <Controller
              name="username"
              control={loginControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!loginErrors.username}
                  helperText={loginErrors.username?.message}
                  disabled={loading}
                />
              )}
            />
            <Controller
              name="password"
              control={loginControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!loginErrors.password}
                  helperText={loginErrors.password?.message}
                  disabled={loading}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.2, fontWeight: "bold" }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <Typography textAlign="center" mt={2}>
            <Link
              component="button"
              variant="body2"
              onClick={() => setForgotOpen((prev) => !prev)}
              sx={{ textDecoration: "none", fontWeight: "bold" }}
            >
              Forgot Password?
            </Link>
          </Typography>
        </CardContent>

        <Collapse in={forgotOpen} timeout={400} unmountOnExit>
          <Box px={4} pb={3}>
            <form onSubmit={handleForgot(onForgot)}>
              <Controller
                name="email"
                control={forgotControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Enter your email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!forgotErrors.email}
                    helperText={forgotErrors.email?.message}
                    disabled={loading}
                  />
                )}
              />
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 1, py: 1.2, fontWeight: "bold" }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Box>
        </Collapse>
      </Card>

      <Typography
        variant="body2"
        color="white"
        sx={{ mt: 4, opacity: 0.8, textAlign: "center" }}
      >
        © 2025 Land Progress Management
      </Typography>
    </Box>
  );
}
