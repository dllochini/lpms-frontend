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
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useGetUnits = () =>
  useQuery({
    queryKey: ["units"],
    queryFn: () => getUnits(),
  });


export default function FarmResources() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const { data: rawResources, isLoading: loadingResources, error: resourcesError } =
    useGetResources();

  const { data: rawUnits, isLoading: loadingUnits, error: unitsError } = useGetUnits();

  const formattedResources = useMemo(() => {
    const arr =
      Array.isArray(rawResources)
        ? rawResources
        : Array.isArray(rawResources?.data)
          ? rawResources.data
          : Array.isArray(rawResources?.resources)
            ? rawResources.resources
            : [];

    return arr.map((r) => ({
      _id: r._id,
      name: r.name,
      category: r.category,
      unit: r.unit,
      qty: r.quantity ?? r.qty ?? 0,
      __raw: r,
    }));
  }, [rawResources]);

  const categories = useMemo(() => {
    const set = new Set(formattedResources.map((r) => r.category).filter(Boolean));
    return Array.from(set);
  }, [formattedResources]);

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

  const handleOpenDialog = () => {
    setFormData({});
    setOpenDialog(true);
  };
  const handleCloseDialog = () => setOpenDialog(false);

  const handleDelete = (deletedId) => {
    // console.log("delete", deletedId);
  };

  const handleEditResource = (resource) => {
    setFormData(resource.__raw ?? resource);
    setOpenDialog(true);
  };

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
          onSuccess={() => {
            queryClient.invalidateQueries(["resources"]);
            handleCloseDialog();
          }}
        />
      </Paper>
    </Box>
  );
}
