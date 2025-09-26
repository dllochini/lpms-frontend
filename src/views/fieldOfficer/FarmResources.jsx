import {
  Typography,
  Box,
  Paper,
  Button,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";

import DataGrid from "../../components/fieldOfficer/ResourceDataGrid";
import ResourceDialog from "../../components/fieldOfficer/ResourceDialogBox";
import { getResources } from "../../api/resources";
import { getUnits } from "../../api/unit";

export default function FarmResources() {
  const [responseData, setResponseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  // ✅ Fetch data from API
  const fetchData = async () => {
    try {
      const resources = await getResources();
      const unitsData = await getUnits();

      const resourcesArray = Array.isArray(resources?.data)
        ? resources.data
        : resources?.resources || [];

      setResponseData(resourcesArray);

      // extract unique categories
      const uniqueCategories = [
        ...new Set(resourcesArray.map((r) => r.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);

      setUnits(
        Array.isArray(unitsData?.data)
          ? unitsData.data
          : unitsData?.units || []
      );
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = () => {
    setFormData({}); // new resource → empty form
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleDelete = (deletedId) => {
    // Keep local state in sync after delete
    setResponseData((prev) => prev.filter((item) => item._id !== deletedId));
  };

  const handleEditResource = (resource) => {
    setFormData(resource); // existing resource → fill form
    setOpenDialog(true);
  };

  return (
    <Box>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Resources
        </Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
             <Link underline="hover" color="inherit" href="./views/fieldOfficer/FieldOfficer">
              Dashboard
            </Link>
            <Typography sx={{ color: 'text.primary' }}>Resources</Typography>
          </Breadcrumbs>
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
          defaultValues={formData}
          categories={categories}
          units={units}
          onSuccess={fetchData} // ✅ refresh after add/edit
        />
      </Paper>
    </Box>
  );
}
