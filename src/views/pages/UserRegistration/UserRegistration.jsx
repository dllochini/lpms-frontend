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

  useEffect(() => {
    async function fetchData() {
      const response = await sampleGetAPI();
      setResponseData(response?.data ?? []);
    }
    fetchData();
  }, []);

  const schema = yup
    .object({
      firstName: yup.string().required("First name is required"),
      // age: yup.number().positive().integer().required(),
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
    },
    resolver: yupResolver(schema),
  });

 

const onSubmit = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/users`, data);
    console.log("Server Response:", response.data);
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
        {/* First Name */}
        <div className="firstNameInputField">
          <InputLabel className="inputLabel">FirstName</InputLabel>
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

        {/* <Controller
        name="select"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={[
              { value: "chocolate", label: "Chocolate" },
              { value: "strawberry", label: "Strawberry" },
              { value: "vanilla", label: "Vanilla" },
            ]}
          />
        )}
      /> */}

        {/* <input type="submit" /> */}

        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>

      <Table data={responseData} />
    </>
  );
};

export default UserRegistration;
