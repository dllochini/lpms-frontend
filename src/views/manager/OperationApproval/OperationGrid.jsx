import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { useState } from "react";
import ConfirmDialog from "../../fieldOfficer/ProgressTrack/ConfirmDialog";

const OperationGrid = ({ data, onDelete, onEdit, onView }) => {

  console.log(data,"every task")
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    try {
      onDelete?.(selectedId);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setOpenDialog(false);
      setSelectedId(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const columns = [
    { field: "landId", headerName: "Land ID", flex: 2 },
    { field: "fieldOfficer", headerName: "Field Officer", flex: 2 },
    { field: "operation", headerName: "Operation", flex: 1.5 },
    { field: "startDate", headerName: "Start Date", flex: 1.5 },
    { field: "completedDate", headerName: "Requested / Completed Date", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={() => onView?.(params.row)}
        >
          View Details
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  const rows = Array.isArray(data)
    ? data.map((row) => ({
        id: row._id ?? index,
        landId: row.process?.land?._id ?? "-",
        fieldOfficer: row.assignedTo?.fullName ?? "N/A",
        operation: row.operation?.name ?? "N/A",
        startDate: row.startDate ? new Date(row.startDate).toLocaleDateString() : "N/A",
        completedDate: row.endDate ? new Date(row.endDate).toLocaleDateString() : "Pending",
      }))
    : [];

  return (
    <>
      <div style={{ width: "100%" }}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          rowHeight={70}
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          density="compact"
          disableRowSelectionOnClick
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          slots={{
            noRowsOverlay: () => (
              <div style={{ padding: 20 }}>No pending operations found.</div>
            ),
          }}
        />
      </div>

      <ConfirmDialog
        open={openDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete resource ${selectedId}?`}
        confirmLabel="Delete"
        confirmColor="error"
      />
    </>
  );
};

export default OperationGrid;
