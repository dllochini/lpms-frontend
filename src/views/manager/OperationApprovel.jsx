import {
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useState, useEffect } from "react";
import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";

import OperationGrid from "../../components/manager/OperationGrid";
import OperationDialog from "../../components/manager/OperationDialog";

// Import from the new API file
// import { getOperationapproval } from "../../api/operationapproval";


const USE_STATIC = true; // toggle this to false to enable API fetch


// Example static data: adjust fields to match what OperationGrid expects
const staticData = [
{
_id: "1",
fieldOfficer: "Road Repair - Zone A",
operation: "Pluging",
startDate: new Date().toISOString(),
compeledDate: "Pending",
},
{
_id: "2",
fieldOfficer: "Water Supply Inspection",
operation: "Bush Clearing",
startDate: new Date().toISOString(),
compeledDate: "Pending",
},
{
_id: "3",
fieldOfficer: "Land Title Review",
operation: "Bush Clearing",
startDate: new Date().toISOString(),
compeledDate: "Pending",
},
];

export default function Operationapproval() {
  const [responseData, setResponseData] =  useState(USE_STATIC ? staticData : []);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const { control, handleSubmit, reset } = useForm();

  // ✅ Fetch data from new API
  const fetchData = async function () {
    try {
      // const response = await getOperationapproval();
      // console.log("API resources:", response);
      setResponseData(response?.data ?? []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  useEffect(() => {
    // console.log("Fetching resources...");
    if(!USE_STATIC) fetchData();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setFormData({});
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleDelete = (deletedId) => {
    setResponseData((prev) => prev.filter((item) => item._id !== deletedId));
  };

  const handleEditResource = (resource) => {
    setFormData(resource);
    setOpenDialog(true);
  };

  const onSubmit = (data) => {
    if (formData._id) {
      // Edit
      setResponseData((prev) =>
        prev.map((item) =>
          item._id === formData._id ? { ...item, ...data } : item
        )
      );
    } else {
      // Create
      setResponseData((prev) => [
        ...prev,
        { ...data, _id: Date.now().toString() },
      ]);
    }

    // reset();
    handleCloseDialog();
  };
  return (
    <Box>
      
        <Box sx={{ p: 2, mb: 3 }}>
          <Stack spacing={2} direction="row" color="error"
              sx={{
                display: "flex",
                justifyContent: "center", // horizontal center
                alignItems: "center",     // vertical center
              }}
          >
            <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate("/user/register")}
              >
              Home
            </Button>
            <Button
                    variant="outlined"
                    color="primary"
                    // onClick={handleOpenDialog}
              >
              Operation Approval 
            </Button>
            <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/user/register")}
                >
                Payment Approval    
            </Button>
            <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/user/register")}
                >
                Land Process    
            </Button>
        </Stack>
    </Box>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Pending Operations Approval
        </Typography>

        <div role="presentation" >
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Typography sx={{ color: 'text.primary' }}>Operation Approval</Typography>
          </Breadcrumbs>
        </div>
      </Box>

      <Paper
        elevation={5}
        sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb:2,
          }}
        >
          {/* <Typography variant="h6"></Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            startIcon={<AddIcon />}
          >
            ADD NEW RESOURCE
          </Button> */}
        </Box>

        <OperationGrid
     
          data={responseData}
          onDelete={handleDelete}
          onEdit={handleEditResource}
          autoHeight
        />
        <OperationDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit(onSubmit)}
          control={control}
          initialData={formData}
        />
      </Paper>
    </Box>
  );
}
