import React, { useCallback, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Box, Button, Collapse, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter,
  TableHead, TableRow, Typography, Divider, Skeleton, Tooltip
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const currency = (val) => Number(val ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDate = (iso) => { try { return iso ? new Date(iso).toLocaleDateString() : "-"; } catch { return "-"; } };

const BillDetailDialog = ({ open, onClose, bill }) => {
  // hooks always at top
  const [expanded, setExpanded] = useState({});

  const taskSubTotals = useMemo(
    () => Array.isArray(bill?.taskSubTotals) ? bill.taskSubTotals : [],
    [bill?.taskSubTotals]
  );

  const workdoneList = useMemo(
    () => Array.isArray(bill?.workdoneSubTotals) ? bill.workdoneSubTotals : [],
    [bill?.workdoneSubTotals]
  );

  const workdoneMap = useMemo(() => {
    const map = new Map();
    for (const wd of workdoneList) {
      const taskId = wd?.workDone?.task ?? "__no_task_id__";
      if (!map.has(taskId)) map.set(taskId, []);
      map.get(taskId).push(wd);
    }
    return map;
  }, [workdoneList]);

  // totals
  const subtotalSum = useMemo(
    () => taskSubTotals.reduce((s, t) => s + Number(t.subtotal ?? 0), 0),
    [taskSubTotals]
  );
  const workAmountSum = useMemo(
    () => workdoneList.reduce((s, w) => s + Number(w.amount ?? 0), 0),
    [workdoneList]
  );

  const toggle = useCallback((id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // CSV export
  const handleExportCSV = useCallback(() => {
    const rows = [["Operation", "Resource", "Unit", "Unit Price", "WorkDone", "Subtotal (LKR)"]];
    taskSubTotals.forEach((t, idx) => {
      const task = t.task ?? {};
      const resource = task.resource ?? {};
      const unit = resource.unit ?? {};
      const operationName = task.operation?.name ?? task.operation ?? `Task ${idx + 1}`;
      const taskId = task._id ?? `task-${idx}`;
      const wdEntries = workdoneMap.get(taskId) || [];
      const workTotal = wdEntries.reduce((sum, wd) => sum + Number(wd.workDone?.newWork ?? 0), 0);
      rows.push([operationName, resource.name ?? "-", unit.name ?? unit.symbol ?? "-", currency(resource.unitPrice), workTotal, currency(t.subtotal)]);
    });
    // generate CSV
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bill_${bill?._id ?? "export"}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [taskSubTotals, workdoneMap, bill]);

  // Print (simple): open new window with minimal content
  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const title = `Bill ${bill?._id ?? ""}`;
    let html = `<html><head><title>${title}</title><style>
      table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ccc;padding:6px;text-align:left}
      h1{font-size:16px}
    </style></head><body>`;
    html += `<h1>${title}</h1>`;
    html += `<p>Total (LKR): ${currency(bill?.totalAmount)}</p>`;
    html += `<table><thead><tr><th>Operation</th><th>Resource</th><th>Unit</th><th>Unit Price</th><th>WorkDone</th><th>Subtotal</th></tr></thead><tbody>`;
    taskSubTotals.forEach((t, idx) => {
      const task = t.task ?? {};
      const resource = task.resource ?? {};
      const unit = resource.unit ?? {};
      const operationName = task.operation?.name ?? task.operation ?? `Task ${idx + 1}`;
      const taskId = task._id ?? `task-${idx}`;
      const wdEntries = workdoneMap.get(taskId) || [];
      const workTotal = wdEntries.reduce((sum, wd) => sum + Number(wd.workDone?.newWork ?? 0), 0);
      html += `<tr><td>${operationName}</td><td>${resource.name ?? "-"}</td><td>${unit.name ?? unit.symbol ?? "-"}</td><td style="text-align:right">${currency(resource.unitPrice)}</td><td style="text-align:right">${workTotal}</td><td style="text-align:right">${currency(t.subtotal)}</td></tr>`;
    });
    html += `</tbody></table></body></html>`;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // give the new window a moment to render
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
  }, [taskSubTotals, workdoneMap, bill]);

  // Dialog title id for aria
  const dialogTitleId = "bill-detail-dialog-title";

  // If `bill` is missing, show a lightweight skeleton inside the same dialog
  const isLoading = !bill;

  const process = bill?.process ?? {};
  const land = process?.land ?? {};
  const fieldOfficer = land?.createdBy ?? {};
  const printRef = useRef(null);


  return (
    <>
      <div ref={printRef}>
        <Dialog
          open={!!open}
          onClose={onClose}
          maxWidth="lg"
          fullWidth
          aria-labelledby={dialogTitleId}
        >
          <DialogTitle id={dialogTitleId} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Bill Details</span>
            <Box>
              <Tooltip title="Export CSV">
                <IconButton onClick={handleExportCSV} disabled={isLoading} size="small"><DownloadIcon /></IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton onClick={handlePrint} disabled={isLoading} size="small"><PrintIcon /></IconButton>
              </Tooltip>
            </Box>
          </DialogTitle>

          <DialogContent dividers>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ minWidth: 220 }}>
                  <Typography variant="subtitle2">Bill Info</Typography>
                  {isLoading ? (
                    <>
                      <Skeleton width="50%" />
                      <Skeleton width="70%" />
                      <Skeleton width="40%" />
                    </>
                  ) : (
                    <>
                      <Typography variant="body2"><strong>Bill ID:</strong> {bill._id ?? "-"}</Typography>
                      <Typography variant="body2"><strong>Process ID:</strong> {process._id ?? "-"}</Typography>
                      <Typography variant="body2"><strong>Created:</strong> {formatDate(bill.createdAt)}</Typography>
                      <Typography variant="body2"><strong>Status:</strong> {bill.status ?? "-"}</Typography>
                    </>
                  )}
                </Box>

                <Box sx={{ minWidth: 260 }}>
                  <Typography variant="subtitle2">Land & Officer</Typography>
                  {isLoading ? (
                    <>
                      <Skeleton width="80%" />
                      <Skeleton width="70%" />
                    </>
                  ) : (
                    <>
                      <Tooltip title={land.address ?? "-"}>
                        <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300 }}>
                          <strong>Address:</strong> {land.address ?? "-"}
                        </Typography>
                      </Tooltip>
                      <Typography variant="body2"><strong>Field Officer:</strong> {fieldOfficer.fullName ?? "-"}</Typography>
                      <Typography variant="body2"><strong>Process Start:</strong> {formatDate(process.startedDate)}</Typography>
                      <Typography variant="body2"><strong>Process End:</strong> {formatDate(process.endDate)}</Typography>
                    </>
                  )}
                </Box>

                <Box sx={{ textAlign: "right", minWidth: 140 }}>
                  <Typography variant="h6">Total (LKR)</Typography>
                  {isLoading ? <Skeleton width={120} /> : <Typography variant="h5" fontWeight="bold">{currency(bill.totalAmount)}</Typography>}
                </Box>
              </Box>

              {!isLoading && bill.notes && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Tooltip title={bill.notes}>
                    <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <strong>Notes:</strong> {bill.notes}
                    </Typography>
                  </Tooltip>
                </>
              )}
            </Paper>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small" aria-label="bill tasks table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Operation</TableCell>
                    <TableCell>Resource</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">WorkDone</TableCell>
                    <TableCell align="right">Subtotal (LKR)</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isLoading ? (
                    // show a few skeleton rows while loading
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton width={32} /></TableCell>
                        <TableCell><Skeleton width="60%" /></TableCell>
                        <TableCell><Skeleton width="60%" /></TableCell>
                        <TableCell><Skeleton width="40%" /></TableCell>
                        <TableCell align="right"><Skeleton width={60} /></TableCell>
                        <TableCell align="right"><Skeleton width={40} /></TableCell>
                        <TableCell align="right"><Skeleton width={80} /></TableCell>
                      </TableRow>
                    ))
                  ) : taskSubTotals.length === 0 ? (
                    <TableRow><TableCell colSpan={7} align="center">No tasks in this bill.</TableCell></TableRow>
                  ) : taskSubTotals.map((t, idx) => {
                    const task = t.task ?? {};
                    const resource = task.resource ?? {};
                    const unit = resource.unit ?? {};
                    const operationName = task.operation?.name ?? task.operation ?? `Task ${idx + 1}`;
                    const taskId = task._id ?? `task-${idx}`;

                    const wdEntries = workdoneMap.get(taskId) || [];
                    const workTotal = wdEntries.reduce((sum, wd) => sum + Number(wd.workDone?.newWork ?? 0), 0);

                    return (
                      <React.Fragment key={taskId}>
                        <TableRow
                          hover
                          sx={{ cursor: "pointer" }}
                          onClick={() => toggle(taskId)}
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle(taskId); }}
                        >
                          <TableCell width={48}>
                            <IconButton
                              size="small"
                              onClick={(e) => { e.stopPropagation(); toggle(taskId); }}
                              aria-label={expanded[taskId] ? "Collapse work details" : "Expand work details"}
                              aria-expanded={!!expanded[taskId]}
                              aria-controls={`workdone-panel-${taskId}`}
                            >
                              {expanded[taskId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell>{operationName}</TableCell>
                          <TableCell>{resource.name ?? "-"}</TableCell>
                          <TableCell>{unit.name ?? unit.symbol ?? "-"}</TableCell>
                          <TableCell align="right">{currency(resource.unitPrice)}</TableCell>
                          <TableCell align="right">{wdEntries.length === 0 ? "-" : workTotal}</TableCell>
                          <TableCell align="right">{currency(t.subtotal)}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0 }}>
                            <Collapse in={!!expanded[taskId]} timeout="auto" unmountOnExit>
                              <Box sx={{ m: 1 }} id={`workdone-panel-${taskId}`}>
                                <Typography variant="subtitle2" gutterBottom>Work done details</Typography>
                                <Table size="small" aria-label={`work entries for ${operationName}`}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Start</TableCell>
                                      <TableCell>End</TableCell>
                                      <TableCell align="right">Work</TableCell>
                                      <TableCell>Notes</TableCell>
                                      <TableCell align="right">Amount (LKR)</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {wdEntries.length === 0 ? (
                                      <TableRow><TableCell colSpan={5} align="center">No work entries</TableCell></TableRow>
                                    ) : wdEntries.map((wd, wIdx) => (
                                      <TableRow key={wd._id ?? `${taskId}-wd-${wIdx}`}>
                                        <TableCell>{formatDate(wd.workDone?.startDate)}</TableCell>
                                        <TableCell>{formatDate(wd.workDone?.endDate)}</TableCell>
                                        <TableCell align="right">{wd.workDone?.newWork ?? "-"}</TableCell>
                                        <TableCell>{wd.workDone?.notes ?? "-"}</TableCell>
                                        <TableCell align="right">{currency(wd.amount)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>

                {!isLoading && (
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={5} align="right"><strong>Calculated totals</strong></TableCell>
                      <TableCell align="right"><strong>{workAmountSum ? currency(workAmountSum) : "-"}</strong></TableCell>
                      <TableCell align="right"><strong>{currency(subtotalSum)}</strong></TableCell>
                    </TableRow>
                    {Number(bill.totalAmount ?? 0) !== subtotalSum && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ color: "error.main" }}>
                          Warning: bill.totalAmount ({currency(bill.totalAmount)}) does not match sum of subtotals ({currency(subtotalSum)})
                        </TableCell>
                      </TableRow>
                    )}
                  </TableFooter>
                )}
              </Table>
            </TableContainer>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

BillDetailDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  bill: PropTypes.object,
};

BillDetailDialog.defaultProps = {
  open: false,
  onClose: () => { },
  bill: null,
};

export default React.memo(BillDetailDialog);
