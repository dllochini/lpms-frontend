import axiosBackend from "../configs/axios-config";

export const getFieldOfficerDashboardCardInfo = (landId) =>
  axiosBackend.get(`/fieldOfficer/land/${landId}/cards`);
