import axiosBackend from "../configs/axios-config";

export const getFieldOfficerDashboardCardInfo = (divisionId) =>
  axiosBackend.get(`/fieldOfficer/division/${divisionId}/cards`);
