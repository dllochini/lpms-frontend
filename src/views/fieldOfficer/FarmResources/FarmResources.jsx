import React, { useMemo, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Button,
  Breadcrumbs,
  Link,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink } from "react-router-dom";

import DataGrid from "./ResourceDataGrid";
import ResourceDialog from "./ResourceDialogBox";
import { getUnits } from "../../../api/unit";
import { useGetResources } from "../../../hooks/resource.hook";
import { useQuery } from "@tanstack/react-query";

/**
 * Optional helper hook — if you already have a useGetUnits hook,
 * replace the call below with that.
 */
const useGetUnits = () =>
  useQuery({
    queryKey: ["units"],
    queryFn: () => getUnits(),
    // keep previous data etc. as desired
  });

export default function FarmResources() {
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  // use your existing hook for resources
  // NOTE: your hook's return shape may be either an array or an object { success, count, data }
  const { data: rawResources, isLoading: loadingResources, error: resourcesError } =
    useGetResources();

  // units via useQuery (or useGetUnits)
  const { data: rawUnits, isLoading: loadingUnits, error: unitsError } = useGetUnits();

  // Normalize resources into a flat array that your DataGrid expects
  // We guard for multiple possible response shapes:
  //  - array directly
  //  - { data: [...] }
  //  - { resources: [...] }
  const formattedResources = useMemo(() => {
    const arr =
      Array.isArray(rawResources)
        ? rawResources
        : Array.isArray(rawResources?.data)
        ? rawResources.data
        : Array.isArray(rawResources?.resources)
        ? rawResources.resources
        : [];

    // map/flatten to the shape your DataGrid expects (example fields — adapt to your grid)
    return arr.map((r) => ({
      _id: r._id,
      name: r.name,
      category: r.category,
      unit: r.unit, // may be id or populated object
      qty: r.quantity ?? r.qty ?? 0,
      // keep original full object if needed
      __raw: r,
    }));
  }, [rawResources]);

  // categories derived from formattedResources
  const categories = useMemo(() => {
    const set = new Set(formattedResources.map((r) => r.category).filter(Boolean));
    return Array.from(set);
  }, [formattedResources]);

  // Normalize units (guarding for possible response shapes)
  const units = useMemo(() => {
    const arr =
      Array.isArray(rawUnits)
        ? rawUnits
        : Array.isArray(rawUnits?.data)
        ? rawUnits.data
        : Array.isArray(rawUnits?.units)
        ? rawUnits.units
        : [];
    return arr;
  }, [rawUnits]);

  // Dialog handlers
  const handleOpenDialog = () => {
    setFormData({});
    setOpenDialog(true);
  };
  const handleCloseDialog = () => setOpenDialog(false);

  const handleDelete = (deletedId) => {
    console.log("delete", deletedId);
  };

  const handleEditResource = (resource) => {
    // resource can be the full raw object or formatted row
    setFormData(resource.__raw ?? resource);
    setOpenDialog(true);
  };

  // Loading & error states
  const isLoading = loadingResources || loadingUnits;
  const isError = resourcesError || unitsError;

  return (
    <Box>
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Resources
        </Typography>

        <Breadcrumbs aria-label="breadcrumb">
          <Link
            component={RouterLink}
            to="/fieldOfficer"
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} /> Home
          </Link>
          <Typography sx={{ color: "text.primary" }}>Resources</Typography>
        </Breadcrumbs>
      </Box>

      <Paper elevation={5} sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            startIcon={<AddIcon />}
            disabled={isLoading}
          >
            ADD NEW RESOURCE
          </Button>
        </Box>

        {isError ? (
          <Typography color="error">Error loading data</Typography>
        ) : (
          <DataGrid
            data={formattedResources}
            onDelete={handleDelete}
            onEdit={handleEditResource}
            loading={isLoading}
          />
        )}

        <ResourceDialog
          open={openDialog}
          onClose={handleCloseDialog}
          defaultValues={formData}
          categories={categories}
          units={units}
          // onSuccess: you should refetch queries using react-query in real flow,
          // but you asked to avoid effects — the dialog can call queryClient.invalidateQueries on success
          // Here we simply close dialog; best practice: call queryClient.invalidateQueries(["resources"])
          onSuccess={() => {
            handleCloseDialog();
            // ideally call queryClient.invalidateQueries(["resources"]) here
          }}
        />
      </Paper>
    </Box>
  );
}
