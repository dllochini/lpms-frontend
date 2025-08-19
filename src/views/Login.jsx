import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Collapse,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import bgImage from "/images/sugar-cane.jpg";
import companyLogo from "/images/ceylon-sugar-industries.png";
import { loginUser, forgotPassword } from "../api/auth"; // Import your API functions
import { redirectByRole } from "../utils/redirectByRole";
import { useNavigate } from "react-router-dom";

const loginSchema = yup.object().shape({
  email: yup.string().required("email is required"),
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
  // const { setError: setFieldError } = useForm();
  const navigate = useNavigate();

  const {
    control: loginControl,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const {
    control: forgotControl,
    handleSubmit: handleForgot,
    formState: { errors: forgotErrors },
    setError: setForgotFieldError,
  } = useForm({ resolver: yupResolver(forgotSchema) });

  const onLogin = async (data) => {
    setLoading(true);
    setSuccess(null);

    try {
      const response = await loginUser(data);
      // console.log("Login response message:", response.data.message);
      // const { token, role } = response.data;
      const role = response.data.role;
      // Save auth data
      // localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setSuccess("Login successful!");

      // Redirect
      const path = redirectByRole(role);
      console.log(role);
      console.log("Redirecting to:", path);
      navigate(path);
    } catch (err) {
      // const backendMessage = err.response?.data?.error || "Login failed";
      setError(err.response?.data?.error || "Login failed");
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
    } catch (err) {
      const backendMessage = err.response?.data?.error || "Request failed";

      if (backendMessage.toLowerCase().includes("email")) {
        setForgotFieldError("email", {
          type: "manual",
          message: backendMessage,
        });
      } else {
        setError(backendMessage);
      }
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

          <form onSubmit={handleLogin(onLogin)} style={{ marginBottom: 1 }}>
            <Controller
              name="email"
              control={loginControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!loginErrors.email}
                  helperText={loginErrors.email?.message}
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

            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 1, py: 1.2, fontWeight: "bold" }}
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
