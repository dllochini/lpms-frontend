import axiosBackend from "../configs/axios-config";

export const getManagerDashboardCardInfo = (divisionId) => {
  // console.log("Hi api!");
  // RETURN the axios promise
  return axiosBackend.get(`/managers/division/${divisionId}/cards`);
};

export default {
  getManagerDashboardCardInfo,
};
