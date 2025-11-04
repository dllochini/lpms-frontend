// src/api/higherManager.js
import axiosBackend from "../configs/axios-config";

// Fetch Field Officer dashboard data by divisionId
export const getHigherManagerDashboardCardInfo = (divisionId) => {
  

  // If a divisionId is provided, get data for that division
  if (divisionId) {
    return axiosBackend.get(`/higherManager/division/${divisionId}/cards`);
  }
  
  // If no divisionId is provided (i.e., for a Higher Manager),
  // call the global '/cards' route we added.
  return axiosBackend.get(`/higherManager/cards`);
};