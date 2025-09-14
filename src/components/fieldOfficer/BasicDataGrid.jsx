

// import * as React from "react";
// import { DataGrid as MuiDataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import Button from "@mui/material/Button";

// import { useState } from "react";

// const BasicDataGrid = ({ data, onDelete, onEdit }) => {
//   // Delete dialog state
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [selectedUserName, setSelectedUserName] = useState("");

//   // Delete handlers
//   const handleDeleteClick = (id) => {
//     const user = data.find((u) => u._id === id);
//     setSelectedUserName(user ? user.fullName : "");
//     setSelectedId(id);
//     setOpenDialog(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (selectedId) {
//       try {
//         // await deleteOperationById(selectedId);
//         if (onDelete) {
//           onDelete(selectedId);
//         }
//       } catch (error) {
//         console.error("Delete failed:", error);
//       }
//     }
//     setOpenDialog(false);
//     setSelectedId(null);
//   };

//   const handleCancelDelete = () => {
//     setOpenDialog(false);
//     setSelectedId(null);
//   };

//   // Edit handler
//   const handleEditClick = (id) => {
//     const row = data.find((u) => u._id === id);
//     if (onEdit && row) {
//       onEdit(row);
//     }
//   };

//   // Columns config
//   const columns = [
//     { field: "_id", headerName: "Operation ID", flex: 4 },
//     {
//       field: "name",
//       headerName: "Operation Name",
//       flex: 3,
//     },
//     // {
//     //   field: "relatedMachines",
//     //   headerName: "Related Machines",
//     //   flex: 3,
//     // },
//     // {
//     //   field: "relatedImplements",
//     //   headerName: "Related Implements",
//     //   flex: 3,
//     // },
//     {
//       field: "note",
//       headerName: "Note",
//       flex: 3,
//     },
//     {
//       field: "actions",
//       type: "actions",
//       headerName: "Action",
//       flex: 1.5,
//       getActions: (params) => [
//         <GridActionsCellItem
//           icon={<EditIcon />}
//           label="Edit"
//           onClick={() => handleEditClick(params.id)}
//           key="edit"
//         />,
//         <GridActionsCellItem
//           icon={<DeleteIcon />}
//           label="Delete"
//           onClick={() => handleDeleteClick(params.id)}
//           key="delete"
//         />,
//       ],
//       sortable: false,
//       filterable: false,
//     },
//   ];

//   const rows = Array.isArray(data)
//     ? data.map((row) => ({
//         id: row._id,
//         ...row,
//       }))
//     : [];

//   return (
//     <>
//       <div style={{ width: "100%" }}>
//         <MuiDataGrid
//           autoHeight
//           rows={rows}
//           columns={columns}
//           pageSizeOptions={[10, 20, 50]}
//           initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
//           density="compact"
//           getRowClassName={(params) =>
//             params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
//           }
//           disableColumnResize
//           checkboxSelection={false}
//           disableRowSelectionOnClick
//         />
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={openDialog} onClose={handleCancelDelete}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete <strong>{selectedUserName}</strong>?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCancelDelete} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleConfirmDelete} color="error">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default BasicDataGrid;



import {
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Button,
  LinearProgress,
  Avatar,
  Stack,
  Collapse,
  IconButton,
 
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

export default function ProgressTrack() {
  // Sample tasks
  const [tasks, setTasks] = useState([
    { id: 1, name: "Bush Clearing", progress: 100 },
    { id: 2, name: "Ploughing", progress: 50 },
  ]);

  // Track which task is expanded
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  // Sample table rows for each task
  const [sampleTableRows] = useState([
    {
      id: 1,
      date: "2025-09-10",
      machine: "Tractor",
      unit: "Ha",
      todayProgress: 20,
      note: "Started field",
    },
    {
      id: 2,
      date: "2025-09-11",
      machine: "Plough",
      unit: "Ha",
      todayProgress: 30,
      note: "Continued work",
    },
  ]);

  

  // Handlers
  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      name: `Task ${tasks.length + 1}`,
      progress: 0,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleExpand = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };


  
 
 

  // Columns for DataGrid
  const columns = [
    { field: "id", headerName: "Task ID", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "machine", headerName: "Type of Machine", flex: 1 },
    { field: "unit", headerName: "Unit", flex: 1 },
    { field: "todayProgress", headerName: "Today Progress", flex: 1 },
    { field: "note", headerName: "Note", flex: 1 },
   
  ];

  return (
    <Box>
      {/* Header + Breadcrumbs */}
      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        <Typography variant="h5" gutterBottom>
          L1324 Progress Overview
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
          <Typography color="text.primary">Progress Overview</Typography>
        </Breadcrumbs>
      </Box>

      {/* Cycle Info */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          px: 3,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          CYCLE 1
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start Date: 2025 Aug 06
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Estimated End Date: 2025 Dec 07
        </Typography>
        <Typography variant="body2" color="green" fontWeight="bold">
          STATUS: IN PROGRESS
        </Typography>
      </Box>

      {/* Task List */}
      <Paper elevation={3} sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          {tasks.map((task) => (
            <Paper key={task.id} sx={{ p: 2, borderRadius: 2 }} elevation={1}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar>{task.name.charAt(0)}</Avatar>
                  <Typography variant="body1">{task.name}</Typography>
                </Box>
                <Box sx={{ flex: 1, mx: 3 }}>
                  <LinearProgress
                    variant="determinate"
                    value={task.progress}
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 40 }}>
                  {task.progress}%
                </Typography>
                <IconButton onClick={() => toggleExpand(task.id)}>
                  {expandedTaskId === task.id ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>

              {/* Collapse DataGrid */}
              <Collapse in={expandedTaskId === task.id} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2, width: "100%" }}>
                  <DataGrid
                    autoHeight
                    rows={sampleTableRows}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    disableRowSelectionOnClick
                  />

                  {/* Buttons under the table */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
                    <Button variant="contained" color="primary">
                      Add New Progress
                    </Button>
                    <Button variant="contained" color="primary">
                      Done
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </Paper>
          ))}
        </Stack>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddTask}
          >
            ADD NEW TASK
          </Button>
          <Button variant="outlined" color="success" startIcon={<CheckCircleIcon />}>
            DONE
          </Button>
        </Box>
      </Paper>

     
    </Box>
  );
}
