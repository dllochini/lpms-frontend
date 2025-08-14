// import {
//     Typography,
//     Box,
//     Paper,
//     Button,
//     Breadcrumbs,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     Grid,
//     InputLabel
//   } from "@mui/material";
//   import AddIcon from "@mui/icons-material/Add";
//   import HomeIcon from "@mui/icons-material/Home";
//   import { getUsers } from "../../api/user";
//   import { useState, useEffect } from "react";
// //   import { useNavigate } from "react-router-dom";
//   import * as React from "react";
//   import DataGrid from "../../components/fieldOfficer/BasicDataGrid";
//   import { Controller, useForm } from "react-hook-form";
//   import { FormControl, Select, MenuItem } from "@mui/material";

  
//   export default function Operation() {
//     // const navigate = useNavigate();
//     const [responseData, setResponseData] = useState([]);
  
//     // ✅ Dialog state
//     const [openDialog, setOpenDialog] = useState(false);
//     const handleOpenDialog = () => setOpenDialog(true);
//     const handleCloseDialog = () => setOpenDialog(false);
  
//     // ✅ react-hook-form setup
//     const { control, handleSubmit, reset } = useForm();
  
//     // Fetch API data
//     const fetchData = async function () {
//       const response = await getUsers();
//       setResponseData(response?.data ?? []);
//     };
  
//     useEffect(() => {
//       fetchData();
//     }, []);
  
//     const handleDelete = (deletedUserId) => {
//       setResponseData((prev) => prev.filter((user) => user._id !== deletedUserId));
//     };
  
//     // ✅ Form submit handler
//     const onSubmit = (data) => {
//       console.log("Form Data:", data);
  
//       // Add the new task locally (mock example)
//       setResponseData((prev) => [
//         ...prev,
//         { _id: Date.now().toString(), name: data.operationName }
//       ]);
  
//       reset(); // clear form
//       handleCloseDialog();
//     };
  
//     return (
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
//               mb: 2
//             }}
//           >
//             <Typography variant="h6"></Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleOpenDialog}
//               startIcon={<AddIcon />}
//             >
//               ADD NEW OPERATION
//             </Button>
//           </Box>
  
//           <DataGrid data={responseData} onDelete={handleDelete} />
  
//           {/* Dialog */}
//           <Dialog
//           open={openDialog}
//           onClose={handleCloseDialog}
//           fullWidth
//           maxWidth="sm"
//           PaperProps={{
//             sx: {
//               borderRadius: "20px", // rounded corners
//               overflow: "hidden",
//             },
//           }}
//         >
//           <DialogTitle
//             sx={{
//               fontWeight: "bold",
//               textAlign: "center",
//               fontSize: "1.25rem",
//               py: 2,
//             }}
//           >
//             Add New Operation
//           </DialogTitle>

//           <DialogContent sx={{ px: 4, pb: 2 }}>
//             {/* Name of Operation */}
//             <InputLabel sx={{ mb: 0.5 }}>Name of Operation :</InputLabel>
//             <Controller
//               name="operationName"
//               control={control}
//               defaultValue=""
//               render={({ field }) => (
//                 <TextField {...field} fullWidth size="small" sx={{ mb: 2 }} />
//               )}
//             />

//             {/* Related Machines */}
//             <InputLabel sx={{ mb: 0.5 }}>Related Machines :</InputLabel>
//             <Controller
//               name="relatedMachine"
//               control={control}
//               defaultValue=""
//               render={({ field }) => (
//                 <FormControl fullWidth size="small" sx={{ mb: 1 }}>
//                   <Select {...field} displayEmpty>
//                     <MenuItem value="">Select</MenuItem>
//                     {/* <MenuItem value="Tractor">Tractor</MenuItem>
//                     <MenuItem value="Harvester">Harvester</MenuItem> */}
//                   </Select>
//                 </FormControl>
//               )}
//             />
//             <Button
//               variant="contained"
//               sx={{
//                 borderRadius: "20px",
//                 textTransform: "none",
//                 fontWeight: "bold",
//                 mb: 2,
//               }}
//             >
//               Add New Machine
//             </Button>

//             {/* Related Implements */}
//             <InputLabel sx={{ mb: 0.5 }}>Related Implements :</InputLabel>
//             <Controller
//               name="relatedImplement"
//               control={control}
//               defaultValue=""
//               render={({ field }) => (
//                 <TextField {...field} fullWidth size="small" sx={{ mb: 2 }} />
//               )}
//             />

//             {/* Note */}
//             <InputLabel sx={{ mb: 0.5 }}>Note :</InputLabel>
//             <Controller
//               name="note"
//               control={control}
//               defaultValue=""
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   fullWidth
//                   size="small"
//                   multiline
//                   minRows={3}
//                   sx={{ mb: 1 }}
//                 />
//               )}
//             />
//           </DialogContent>

//           <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <Button
//                 onClick={handleCloseDialog}
//                 variant="contained"
//                 sx={{
//                   borderRadius: "20px",
//                   textTransform: "none",
//                   fontWeight: "bold",
//                   px: 4,
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSubmit(onSubmit)}
//                 sx={{
//                   borderRadius: "20px",
//                   textTransform: "none",
//                   fontWeight: "bold",
//                   px: 4,
//                 }}
//               >
//                 Create
//               </Button>
//             </Box>
//           </DialogActions>
//         </Dialog>


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
  InputLabel
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { getUsers } from "../../api/user";
import { useState, useEffect } from "react";
import * as React from "react";
import DataGrid from "../../components/fieldOfficer/BasicDataGrid";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";


export default function Operation() {
  const [responseData, setResponseData] = useState([]);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // for edit mode

  const { control, handleSubmit, reset } = useForm();

  // Fetch API data
  const fetchData = async () => {
    const response = await getUsers();
    setResponseData(response?.data ?? []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete handler
  const handleDelete = (deletedUserId) => {
    setResponseData((prev) => prev.filter((user) => user._id !== deletedUserId));
  };

  // ADD button click
  const handleOpenAddDialog = () => {
    setSelectedRow(null);
    reset({
      operationName: "",
      relatedMachine: "",
      relatedImplement: "",
      note: ""
    });
    setOpenDialog(true);
  };

  // EDIT button click (from BasicDataGrid)
  const handleOpenEditDialog = (row) => {
    setSelectedRow(row);
    reset({
      operationName: row.operationName || "",
      relatedMachine: row.relatedMachines || "",
      relatedImplement: row.relatedImplements || "",
      note: row.note || ""
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  // Save form
  const onSubmit = (data) => {
    if (selectedRow) {
      // Update existing row
      setResponseData((prev) =>
        prev.map((item) =>
          item._id === selectedRow._id
            ? { ...item, ...data }
            : item
        )
      );
    } else {
      // Add new row
      setResponseData((prev) => [
        ...prev,
        { _id: Date.now().toString(), ...data }
      ]);
    }
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
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Home
          </Link>
          <Typography color="text.primary">Operations</Typography>
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
            onClick={handleOpenAddDialog}
            startIcon={<AddIcon />}
          >
            ADD NEW OPERATION
          </Button>
        </Box>

        <DataGrid
          data={responseData}
          onDelete={handleDelete}
          onEdit={handleOpenEditDialog} // pass edit handler
        />

        {/* Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "20px",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "1.25rem",
              py: 2,
            }}
          >
            {selectedRow ? "Edit Operation" : "Add New Operation"}
          </DialogTitle>

          <DialogContent sx={{ px: 4, pb: 2 }}>
            {/* Name of Operation */}
            <InputLabel sx={{ mb: 0.5 }}>Name of Operation :</InputLabel>
            <Controller
              name="operationName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} fullWidth size="small" sx={{ mb: 2 }} />
              )}
            />

            {/* Related Machines */}
            <InputLabel sx={{ mb: 0.5 }}>Related Machines :</InputLabel>
            <Controller
              name="relatedMachine"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} fullWidth size="small" sx={{ mb: 2 }} />
              )}
            />

            {/* Related Implements */}
            <InputLabel sx={{ mb: 0.5 }}>Related Implements :</InputLabel>
            <Controller
              name="relatedImplement"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} fullWidth size="small" sx={{ mb: 2 }} />
              )}
            />

            {/* Note */}
            <InputLabel sx={{ mb: 0.5 }}>Note :</InputLabel>
            <Controller
              name="note"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  multiline
                  minRows={3}
                  sx={{ mb: 1 }}
                />
              )}
            />
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={handleCloseDialog}
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 4,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  fontWeight: "bold",
                  px: 4,
                }}
              >
                {selectedRow ? "Update" : "Create"}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

  