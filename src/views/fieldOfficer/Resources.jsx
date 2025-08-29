// import {
//     Typography,
//     Box,
//     Paper,
//     Button,
//   } from "@mui/material";
//   import { getUsers } from "../../api/user";
//   import { useState, useEffect } from "react";
//   import { useNavigate } from "react-router-dom";
//   import * as React from "react";
//   import DataGrid from "../../components/fieldOfficer/DataGrid";
//   import ResourceDialog from "../../components/fieldOfficer/Dialog";
//   import AddIcon from "@mui/icons-material/Add";
//   import { useForm } from "react-hook-form";


//   export default function Resource() {
//     // const navigate = useNavigate();
//     const [responseData, setResponseData] = useState([]);
//     const [formData, setFormData] = useState({}); // State for form data
//     // const [editResource, setEditResource] = useState(null);

  
//     // ✅ Dialog state
//     const [openDialog, setOpenDialog] = useState(false);
//     const handleOpenDialog = () => {
//       setOpenDialog(true);
//       setFormData({}); // Reset form data when opening dialog
//     }
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
  
//     /// ✅ Form submit handler
//     const onSubmit = () => {
//       if (formData._id) {
//         // Edit mode: update existing resource
//         setResponseData(prev =>
//           prev.map(item =>
//            item._id === formData._id ? { ...formData } : item 
//           )
//         );
//       } else {
//         // Create mode: Add new resource
//         const exists = responseData.some(item => item._id === formData._id)
//         if (!exists) {
//           setResponseData((prev) => [
//             ...prev,
//             {...formData, _id: Date.now().toString()} // Mock ID generation
//           ]);
//         }
//       }
//       reset(); // clear form
//       handleCloseDialog();
//     };
//     const handleEditResource = (resource) => {
//       setFormData(resource);  // Fill form with selected resource data      
//       setOpenDialog(true);    // Open the dialog for editing
//     }



//     return (
//       <Box>
//         {/* Greeting & Breadcrumb */}
//         <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
//           <Typography variant="h5" gutterBottom>
//             Resources
//           </Typography>
  
//           {/* <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
//             <Typography color="text.primary">
//               <HomeIcon sx={{ mr: 0.5, fontSize: 18, verticalAlign: "middle" }} />
//               Home
//             </Typography>
//           </Breadcrumbs> */}
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
//               ADD NEW RESOURCE
//             </Button>
//           </Box>
  
//           <DataGrid data={responseData} onDelete={handleDelete}  onEdit={handleEditResource} />
  
//           {/* Dialog for adding/editing resources */}
//           <ResourceDialog
//             open={openDialog}
//             onClose={handleCloseDialog}
//             onSave={handleSubmit(onSubmit)}
//             formData={formData} // Pass empty object for new resource
//             setFormData={setFormData} // Placeholder, not used in this example
//           />

//         </Paper>
//       </Box>
//     );
//   }

import {
  Typography,
  Box,
  Paper,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";

import DataGrid from "../../components/fieldOfficer/DataGrid";
import ResourceDialog from "../../components/fieldOfficer/Dialog";

// Import from the new API file
import { getResources } from "../../api/resources";

export default function Resource() {
  const [responseData, setResponseData] = useState([]);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const { control, handleSubmit, reset } = useForm();

  // ✅ Fetch data from new API
  const fetchData = async () => {
    try {
      const response = await getResources();
      setResponseData(response?.data ?? []);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    }
  };

  useEffect(() => {
    fetchData();
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

  const onSubmit = () => {
    if (formData._id) {
      // Edit
      setResponseData((prev) =>
        prev.map((item) => (item._id === formData._id ? { ...formData } : item))
      );
    } else {
      // Create
      const exists = responseData.some((item) => item._id === formData._id);
      if (!exists) {
        setResponseData((prev) => [
          ...prev,
          { ...formData, _id: Date.now().toString() },
        ]);
      }
    }
    reset();
    handleCloseDialog();
  };

  return (
    <Box>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Resources
        </Typography>
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
            mb: 2,
          }}
        >
          <Typography variant="h6"></Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            startIcon={<AddIcon />}
          >
            ADD NEW RESOURCE
          </Button>
        </Box>

        <DataGrid
          data={responseData}
          onDelete={handleDelete}
          onEdit={handleEditResource}
        />

        <ResourceDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSave={handleSubmit(onSubmit)}
          formData={formData}
          setFormData={setFormData}
        />
      </Paper>
    </Box>
  );
}
