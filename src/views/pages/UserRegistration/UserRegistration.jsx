import Table from "../../components/Table";
import { useState, useEffect } from "react";
import { sampleGetAPI } from "../../../api/user";
import { Box, TextField, InputLabel, Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import "./userRegistration.css";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const UserRegistration = () => {
  const [responseData, setResponseData] = useState([]);

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
      nic: yup.string().matches(/^[0-9]{10}$/, 'Invalid NIC format. Must be with 12 digits or 12 digits with v or V')

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
      nic:"",
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

      console.log("✅ Full Response:", response);
      console.log("✅ Response Data:", response.data); // should work

      fetchData();
      reset();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <>
      <h1>User Registration</h1>

      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="firstNameInputField">
          <InputLabel className="inputLabel">First Name</InputLabel>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-required"
                className="inputField"
                // label="First Name"
              />
            )}
          />
          {errors.firstName && <p>{errors?.firstName?.message}</p>}
        </div>

        <div className="lastNameInputField">
          <InputLabel className="inputLabel">Last Name</InputLabel>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-required"
                className="inputField"
                // label="Last Name"
              />
            )}
          />
          {errors.lastName && <p>{errors?.lastName?.message}</p>}
        </div>

        <div className="emailInputField">
          <InputLabel className="inputLabel">Email</InputLabel>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-required"
                className="inputField"
                // label="Email"
              />
            )}
          />
          {errors.email && <p>{errors?.email?.message}</p>}
        </div>

        <div className="nicInputField">
          <InputLabel className="inputLabel">NIC</InputLabel>
          <Controller
            name="nic"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-required"
                className="inputField"
                // label="NIC"
              />
            )}
          />
          {errors.nic && <p>{errors?.nic?.message}</p>}
        </div>

        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>

      <Table data={responseData} />
    </>
  );
};

export default UserRegistration;
