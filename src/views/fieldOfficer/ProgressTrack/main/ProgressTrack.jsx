
import React, { useState } from "react";
import {
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Button,
  CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink, useParams } from "react-router-dom";
import ProcessOverview from "../ProcessOverview/ProcessOverview";
import { useCreateProcess, useGetProcessByLandId } from "../../../../hooks/process.hook";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDialog from "../ConfirmDialog";
import ErrorDialog from "../ErrorDialog";

export default function ProgressTrack() {
  const { landId } = useParams();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");

  const { data: landProcesses = [], isLoading } = useGetProcessByLandId(
    landId,
    {
      onSuccess: (data) => {
        // console.log("Lands for field officer:", data);
      },
      onError: (error) => {
        console.error("Failed to fetch lands for field officer", error);
      },
    }
  );

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [removingIds, setRemovingIds] = useState(new Set());

  const { mutate: createProcess, isLoading: creatingProcess } = useCreateProcess(landId, {
    onSuccess: () => {
      setOpenConfirmDialog(false);
    },
    onError: (err) => {
      console.error("Create process failed:", err);
      setErrorDialogMessage("Failed to create process. Please try again.");
      setErrorDialogOpen(true);
      setOpenConfirmDialog(false);
    },
  });


  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleAddProcess = () => {
    setOpenConfirmDialog(true);
  };

  const confirmCreateProcess = () => {
    if (creatingProcess) return;
    if (!landId) return;
    setOpenConfirmDialog(false);

    const payload = {
      land: landId,
      startedDate: new Date().toISOString(),
      endDate: null,
    };
    createProcess({ ...payload, landId });
  };

  const allApproved = landProcesses.every((p) => (p.status || "").toLowerCase() === "approved");

  const visibleProcesses = [...landProcesses]
    .sort((a, b) => new Date(b.startedDate) - new Date(a.startedDate))
    .filter((p) => {
      const id = p._id ?? p.id;
      return id ? !removingIds.has(id) : true;
    });

  return (
    <>
      <Box>
        <Box sx={{ maxWidth: 1100, mx: "auto", p: 2, pb: 0 }}>
          <Typography variant="h5" gutterBottom>
            {landId} Progress Overview
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "0.9rem" }}>
            <Link
              component={RouterLink}
              to="/fieldOfficer"
              underline="hover"
              color="inherit"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Home
            </Link>
            <Typography color="text.primary">Progress Overview</Typography>
          </Breadcrumbs>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            maxWidth: 1100,
            mx: "auto",
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddProcess}
            disabled={!allApproved}
          >
            ADD NEW CYCLE
          </Button>
        </Box>

        {visibleProcesses.map((proc, index) => {

          const id = proc._id ?? proc.id ?? index;

          return (
            <Box key={id} sx={{ maxWidth: 1100, mx: "auto", mb: 2 }}>
              <ProcessOverview
                process={proc}
                onDeleted={(id) => setRemovingIds((prev) => new Set(prev).add(id))
                }
              />
            </Box>
          );
        })}
      </Box>

      {/* Create process confirm */}
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={confirmCreateProcess}
        title="Confirm Create Process"
        message="Are you sure you want to create a new process/cycle?"
        confirmLabel="Create"
        loading={creatingProcess}
        confirmColor="primary"
      />

      <ErrorDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        message={errorDialogMessage}
      />
    </>
  );
}
