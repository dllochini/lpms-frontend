import axiosBackend from "../configs/axios-config";

export const getManagerDashboardCardInfo = (divisionId) =>
  axiosBackend.get(`/manager/division/${divisionId}/cards`);

export default { getManagerDashboardCardInfo };
