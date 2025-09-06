import React from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";

const steps = ["Farmer Details", "Land Details", "Document Upload","Submission"];

const FormStepper = ({ activeStep }) => {
  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default FormStepper;
