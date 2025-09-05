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
  const fetchData = async function () {
    try {
      const response = await getResources();
      // console.log("API resources:", response);
      setResponseData(response?.data ?? []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  useEffect(() => {
    // console.log("Fetching resources...");
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
