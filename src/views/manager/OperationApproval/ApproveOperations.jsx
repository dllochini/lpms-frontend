import {
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  Breadcrumbs,
  Link,
  CircularProgress,
} from "@mui/material";
import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";

import OperationGrid from "./OperationGrid";
import OperationDialog from "./OperationDialog";
// import { useGetLandsByDivision } from "../../hooks/land.hooks";
import { useGetTasksByDiv } from "../../../hooks/task.hooks";

export default function Operationapproval() {

  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { control } = useForm();

  const { data: tasksData = [], isLoading } = useGetTasksByDiv(localStorage.getItem("loggedUserId"), {
    onSuccess: (data) => {
      console.log("Lands for field officer:", data);
    },
    onError: (error) => {
      console.error("Failed to fetch lands for field officer", error);
    },
  });

  const tasks = useMemo(() => Array.isArray(tasksData) ? tasksData : [], [tasksData]);
  // console.log(tasks,"response")

  // at top of component add new state
  const [selectedTask, setSelectedTask] = useState(null);

  // update handleViewDetails
  const handleViewDetails = (row) => {
    const rowId = row._id ?? row.id;

    // find the matching task in tasks (tasks is from your hook)
    const matchedTask = tasks.find(
      (t) => String(t._id) === String(rowId) || String(t.id) === String(rowId)
    ) ?? null;

    console.log("Clicked row:", row, "matchedTask:", matchedTask);

    setSelectedRow(row);       // existing (grid row)
    setSelectedTask(matchedTask); // NEW (matching task or null)
    setOpenDialog(true);
  };


  const handleOpenDialog = () => {
    setOpenDialog(true);
    setFormData({});
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleDelete = (deletedId) => {
    // setResponseData((prev) => prev.filter((item) => item._id !== deletedId));
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
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Pending Operations Approval
        </Typography>

        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: "0.9rem", mb: 2 }}>
            <Link underline="hover" color="inherit" href="/manager">
              Home
            </Link>
            <Typography sx={{ color: "text.primary" }}>
              Operation Approval
            </Typography>
          </Breadcrumbs>
        </div>
      </Box>

      <Paper
        elevation={5}
        sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <OperationGrid
            data={tasks}
            onDelete={handleDelete}
            onEdit={handleEditResource}
            onView={handleViewDetails}
            autoHeight
          />
        )}

        <OperationDialog
          open={openDialog}
          onClose={handleCloseDialog}
          control={control}
          initialData={selectedRow}
          initialTask={selectedTask}
        />
      </Paper>
    </Box>
  );
}
