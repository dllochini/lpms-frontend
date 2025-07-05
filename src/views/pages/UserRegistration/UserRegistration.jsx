import Table from "../../components/Table";
import { useState, useEffect } from "react";
import { sampleGetAPI } from "../../../api/user";
import {
  Box,
  TextField,
  InputLabel,
  Button,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
// import "./userRegistration.css";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const UserRegistration = () => {
  const [responseData, setResponseData] = useState([]);
  const [submitError, setSubmitError] = useState("");

  const fetchData = async function () {
    const response = await sampleGetAPI();
    setResponseData(response?.data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const schema = yup
    .object({
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      email: yup.string().email(),
      nic: yup
        .string()
        .matches(
          /^[0-9]{10}$/,
          "Invalid NIC format. Must be with 12 digits or 12 digits with v or V"
        ),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      nic: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      console.log("Form Data Sent:", data);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/users/`,
        data
      );

      console.log("Full Response:", response);
      console.log("Response Data:", response.data);

      fetchData();
      reset();
    } catch (error) {
      console.error("Error submitting data:", error);
      setSubmitError(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        User Registration
      </Typography>

      <Box
        component="form"
        sx={{
          // border: 1,
          // borderColor: "red",
          justifyContent: "center",
          // ".inputField": { alignItems:"left", border: 1, marigin:3 },
          display: "flex",
        }}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Paper
          sx={{
            width: "50%",
            padding: 5,
            alignItems: "center",
          }}
        >
          {/* form content  */}
          <Grid
            sx={{
              // border: 1,
              // borderColor: "greenyellow",
              margin: 3,
            }}
          >
            {/* first name and last name container */}
            <Grid
              sx={{
                // border: 1,
                // borderColor: "green",
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              {/* firstName */}
              <Grid
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  // border: 1,
                  // borderColor: "red",
                  width:"50%"
                }}
              >
                <InputLabel className="inputLabel" sx={{paddingBottom: 3, minWidth: 100 }}>First Name : </InputLabel>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="outlined-required"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message || " "}
                      size="small"
                      className="inputField"
                    />
                  )}
                />
              </Grid>

              {/* lastName */}
              <Grid
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  // border: 1,
                  // borderColor: "red",
                  width:"50%"
                }}
              >
                <InputLabel className="inputLabel" sx={{paddingBottom: 3, minWidth: 100 }}>Last Name :</InputLabel>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="outlined-required"
                      size="small"
                      className="inputField"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message || " "}
                      // fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>

          {/* Email */}
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                // border: 1,
                // borderColor: "yellow",
              }}
            >
              <InputLabel className="inputLabel" sx={{paddingBottom: 3, minWidth: 100 }}>Email :</InputLabel>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="outlined-required"
                    size="small"
                    className="inputField"
                    error={!!errors.email}
                    helperText={errors.email?.message || " "}
                  />
                )}
              />
            </Grid>

          {/* NIC */}
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                // border: 1,
                // borderColor: "yellow",
              }}
            >
              <InputLabel className="inputLabel" sx={{paddingBottom: 3, minWidth: 100 }}>NIC :</InputLabel>
              <Controller
                name="nic"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="outlined-required"
                    size="small"
                    className="inputField"
                    sx={{ width: "400px" }}
                    error={!!errors.nic}
                    helperText={errors.nic?.message || " "}
                  />
                )}
              />
            </Grid>
          
          {/* Button */}
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            {submitError && <p>{submitError}</p>}
          </Grid>
        </Paper>
      </Box>

      {/* <Table data={responseData} /> */}
    </>
  );
};

export default UserRegistration;
