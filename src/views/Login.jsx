import setAuthToken from "../utils/setAuthToken"; // see next snippet
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
import { loginUser, forgotPassword } from "../api/auth";
import { redirectByRole } from "../utils/redirectByRole";
import { useNavigate } from "react-router-dom";

const loginSchema = yup.object().shape({
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
});

const forgotSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function LoginPage() {
  const [forgotOpen, setForgotOpen] = useState(false);

  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [loginError, setLoginError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(null);

  const [forgotError, setForgotError] = useState(null);
  const [forgotSuccess, setForgotSuccess] = useState(null);

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
    reset: resetForgotForm,
  } = useForm({ resolver: yupResolver(forgotSchema) });

  // Fixed Login handler
  const onLogin = async (data) => {
    setLoginLoading(true);
    setLoginError(null);
    setLoginSuccess(null);

    try {
      const response = await loginUser(data); // axios POST /auth/login
      console.log("Login response:", response);
      const { role, name, token } = response.data;

      if (!token || !role) {
        setLoginError("Login failed: missing token or role");
        return;
      }

      // Save role + token
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);

      // set default Authorization header for axios
      setAuthToken(token);

      setLoginSuccess("Login successful!");

      // redirect user
      const path = redirectByRole(role);
      navigate(path, { replace: true }); // replace so user can’t go back to login
    } catch (err) {
      setLoginError(err.response?.data?.error || "Login failed");
    } finally {
      // always stop loading
      setLoginLoading(false);
    }
  };

  // Forgot password handler (unchanged except proper finally already present)
  const onForgot = async (data) => {
    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(null);

    try {
      const response = await forgotPassword(data);
      setForgotSuccess(response.data.message);
      resetForgotForm();

      setTimeout(() => setForgotSuccess(null), 5000);
      setTimeout(() => setForgotOpen(false), 5000);
    } catch (err) {
      setForgotError(err.response?.data?.error || "Request failed");
    } finally {
      setForgotLoading(false);
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
        <CardContent sx={{ px: 4, pb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <Box
              component="img"
              src={companyLogo}
              alt="Company Logo"
              sx={{ height: 60, width: "auto" }}
            />
          </Box>

          {/* Login Form */}
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
                  disabled={loginLoading}
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
                  disabled={loginLoading}
                />
              )}
            />

            {loginError && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {loginError}
              </Alert>
            )}
            {loginSuccess && (
              <Alert severity="success" sx={{ mb: 1 }}>
                {loginSuccess}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 1, py: 1.2, fontWeight: "bold" }}
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          {/* Forgot password link */}
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

        {/* Forgot Password Form */}
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
                    disabled={forgotLoading}
                  />
                )}
              />

              {forgotError && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  {forgotError}
                </Alert>
              )}
              {forgotSuccess && (
                <Alert severity="success" sx={{ mb: 1 }}>
                  {forgotSuccess}
                </Alert>
              )}

              <Button
                type="submit"
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 1, py: 1.2, fontWeight: "bold" }}
                disabled={forgotLoading}
              >
                {forgotLoading ? "Submitting..." : "Submit"}
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
