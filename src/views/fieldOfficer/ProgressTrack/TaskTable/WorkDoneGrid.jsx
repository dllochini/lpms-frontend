import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const WorkDoneGrid = ({ workDones = [], onDeleteRow, loading = false, disableDelete = false }) => {
  const columns = [
    { field: "id", headerName: "No", flex: 0.3, minWidth: 60, headerAlign: "center", align: "center" },
    { field: "startDate", headerName: "Started Time", flex: 0.8, minWidth: 130, headerAlign: "center", align: "center" },
    { field: "endDate", headerName: "End Time", flex: 0.8, minWidth: 130, headerAlign: "center", align: "center" },
    { field: "newWork", headerName: "Work Done", flex: 0.7, minWidth: 120, headerAlign: "center", align: "center" },
    { field: "notes", headerName: "Notes", flex: 1.2, minWidth: 200, headerAlign: "center", align: "center" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 100,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton
  onClick={() => onDeleteRow(row)}
  disabled={disableDelete || loading} // disable if prop is true
>
  <DeleteIcon />
</IconButton>

      ),
    },
  ];

  const rows = (Array.isArray(workDones) ? workDones : []).map((work, idx) => {
    const format = (d) => {
      if (!d) return "-";
      try {
        return String(d).includes("T") ? String(d).slice(0, 10) : String(d);
      } catch (e) {
        return String(d);
      }
    };

    return {
      id: work.id ?? work._id ?? `r-${idx + 1}`,
      startDate: work.startDate ? format(work.startDate) : "-",
      endDate: work.endDate ? format(work.endDate) : "-",
      newWork: work.newWork ?? 0,
      notes: work.notes ?? work.note ?? "-",
      __raw: work,
    };
  });

  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      pageSizeOptions={[5, 10]}
      initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
      disableRowSelectionOnClick
      sx={{
        backgroundColor: "white",
        "& .MuiDataGrid-columnHeaders": { backgroundColor: "white", fontWeight: "bold" },
        "& .MuiDataGrid-columnHeaderTitle": { display: "flex", justifyContent: "center", textAlign: "center", width: "100%" },
        "& .MuiDataGrid-cell": { textAlign: "center" },
      }}
    />
  );
};

WorkDoneGrid.propTypes = {
  workDones: PropTypes.array,
  onDeleteRow: PropTypes.func,
  loading: PropTypes.bool,
};

export default WorkDoneGrid;
