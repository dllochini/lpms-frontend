// src/api/higherManager.js
import axiosBackend from "../configs/axios-config";

// Fetch Field Officer dashboard data by divisionId
export const getHigherManagerDashboardCardInfo = (divisionId) =>
  axiosBackend.get(`/higherManager/division/${divisionId}/cards`);
