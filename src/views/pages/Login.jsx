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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import bgImage from "/images/sugar-cane.jpg";
import companyLogo from "/images/ceylon-sugar-industries.png";

// Validation schema
const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const forgotSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function LoginPage() {
  const [forgotOpen, setForgotOpen] = useState(false);

  // Forms
  const {
    control: loginControl,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const {
    control: forgotControl,
    handleSubmit: handleForgot,
    formState: { errors: forgotErrors },
  } = useForm({
    resolver: yupResolver(forgotSchema),
  });

  // Submit handlers
  const onLogin = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // { username, password }
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Save token and role
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.role);
  
        // Redirect based on role
        if (result.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else if (result.role === "user") {
          window.location.href = "/user/dashboard";
        } else {
          // default route
          window.location.href = "/";
        }
      } else {
        alert("Login failed: " + result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  

  const onForgot = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // { email }
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message); // "Password reset link sent to email."
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };
  

  return (
    <Box
      sx={{
        // width: "100%",
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
      {/* Login Card */}
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
          {/* Logo inside CardContent */}
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
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

          {/* <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
            Login
          </Typography> */}

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
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.2, fontWeight: "bold" }}
            >
              Log In
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

        {/* Collapse outside CardContent so it can expand */}
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
                  />
                )}
              />
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 1, py: 1.2, fontWeight: "bold" }}
              >
                Submit
              </Button>
            </form>
          </Box>
        </Collapse>
      </Card>

      {/* Footer */}
      <Typography
        variant="body2"
        color="white"
        sx={{ mt: 4, opacity: 0.8, textAlign: "center" }}
      >
        © 2025 Your Company. All rights reserved.
      </Typography>
    </Box>
  );
}
