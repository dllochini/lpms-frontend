import axiosBackend from "../configs/axios-config";

// Fetch Manager dashboard data by divisionId
export const getManagerDashboardCardInfo = (divisionId) =>
  axiosBackend.get(`/manager/division/${divisionId}/cards`);

export default { getManagerDashboardCardInfo };
