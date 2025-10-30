import axiosBackend from "../configs/axios-config";

// Fetch Field Officer dashboard data by divisionId
export const getFieldOfficerDashboardCardInfo = (divisionId) => axiosBackend.get(`/fieldOfficer/division/${divisionId}/cards`);
