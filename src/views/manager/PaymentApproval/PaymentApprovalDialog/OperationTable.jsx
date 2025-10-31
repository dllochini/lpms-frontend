import React from "react";
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const OperationTable = ({ operations = [], workdone = [], expandedOps, toggleOp }) => {
  const currency = (val) =>
    Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Operation</TableCell>
            <TableCell>Task ID</TableCell>
            <TableCell align="right">Subtotal (LKR)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {operations.length ? (
            operations.map((op, idx) => {
              const task = op.task ?? {};
              const relatedWorkdone = workdone.filter(
                (w) => w.workDone?.task === task._id
              );

              return (
                <React.Fragment key={op._id ?? idx}>
                  <TableRow hover>
                    <TableCell width={48}>
                      <IconButton size="small" onClick={() => toggleOp(idx)}>
                        {expandedOps[idx] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{task.operation?.name ?? `Task ${idx + 1}`}</TableCell>
                    <TableCell>{task._id}</TableCell>
                    <TableCell align="right">{currency(op.subtotal)}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={4} sx={{ p: 0 }}>
                      <Collapse in={!!expandedOps[idx]} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Work Done Details
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Work Done</TableCell>
                                <TableCell>Notes</TableCell>
                                <TableCell align="right">Amount (LKR)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {relatedWorkdone.length ? (
                                relatedWorkdone.map((wd, i) => (
                                  <TableRow key={wd._id ?? i}>
                                    <TableCell>
                                      {new Date(wd.workDone?.startDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      {new Date(wd.workDone?.endDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{wd.workDone?.newWork}</TableCell>
                                    <TableCell>{wd.workDone?.notes ?? "-"}</TableCell>
                                    <TableCell align="right">{currency(wd.amount)}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={5} align="center">
                                    No workdone records
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No operations available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OperationTable;
