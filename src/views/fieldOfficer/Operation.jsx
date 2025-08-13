// import { Typography, Box, Paper, Button, Breadcrumbs } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import HomeIcon from "@mui/icons-material/Home";
// import { getUsers } from "../../api/user";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import * as React from "react";
// import DataGrid from "../../components/fieldOfficer/BasicDataGrid";



// export default function Operation() {
//   const navigate = useNavigate();
//   const [responseData, setResponseData] = useState([]);

//   const fetchData = async function () {
//     const response = await getUsers();
//     // console.log("API users:", response.data);
//     setResponseData(response?.data ?? []);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleDelete = (deletedUserId) => {
//     setResponseData((prev) =>
//       prev.filter((user) => user._id !== deletedUserId)
//     );
//   };

 

//   return (
//       <Box>
//         {/* Greeting & Breadcrumb */}
//         <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
//           <Typography variant="h5" gutterBottom>
//             Operations
//           </Typography>
  
//           <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
//             <Typography color="text.primary">
//               <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
//               Home
//             </Typography>
//           </Breadcrumbs>
//         </Box>
  
//         {/* Main Content */}
//         <Paper
//           elevation={5}
//           sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mb: 2,
//             }}
//           >
//             <Typography variant="h6">  </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//             //   startIcon={<AddIcon />}
//             //   onClick={() => navigate("/user/register")}
//             >
//               ADD NEW TASK
//             </Button>
//           </Box>
//          <DataGrid data={responseData} onDelete={handleDelete} />
//         </Paper>
//       </Box>
//     );
//   }
  

import {
    Typography,
    Box,
    Paper,
    Button,
    Breadcrumbs,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    InputLabel
  } from "@mui/material";
  import AddIcon from "@mui/icons-material/Add";
  import HomeIcon from "@mui/icons-material/Home";
  import { getUsers } from "../../api/user";
  import { useState, useEffect } from "react";
//   import { useNavigate } from "react-router-dom";
  import * as React from "react";
  import DataGrid from "../../components/fieldOfficer/BasicDataGrid";
  import { Controller, useForm } from "react-hook-form";
  
  export default function Operation() {
    // const navigate = useNavigate();
    const [responseData, setResponseData] = useState([]);
  
    // ✅ Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);
  
    // ✅ react-hook-form setup
    const { control, handleSubmit, reset } = useForm();
  
    // Fetch API data
    const fetchData = async function () {
      const response = await getUsers();
      setResponseData(response?.data ?? []);
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const handleDelete = (deletedUserId) => {
      setResponseData((prev) => prev.filter((user) => user._id !== deletedUserId));
    };
  
    // ✅ Form submit handler
    const onSubmit = (data) => {
      console.log("Form Data:", data);
  
      // Add the new task locally (mock example)
      setResponseData((prev) => [
        ...prev,
        { _id: Date.now().toString(), name: data.operationName }
      ]);
  
      reset(); // clear form
      handleCloseDialog();
    };
  
    return (
      <Box>
        {/* Greeting & Breadcrumb */}
        <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Operations
          </Typography>
  
          <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
            <Typography color="text.primary">
              <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
              Home
            </Typography>
          </Breadcrumbs>
        </Box>
  
        {/* Main Content */}
        <Paper
          elevation={5}
          sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2
            }}
          >
            <Typography variant="h6"></Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
              startIcon={<AddIcon />}
            >
              ADD NEW TASK
            </Button>
          </Box>
  
          <DataGrid data={responseData} onDelete={handleDelete} />
  
          {/* Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
            <DialogTitle>Add New Task</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <InputLabel>Name of Operation:</InputLabel>
                </Grid>
                <Grid item xs={8}>
                  <Controller
                    name="operationName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} id="outlined-required" size="small" fullWidth />
                    )}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    );
  }
  