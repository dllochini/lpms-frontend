import axiosBackend from "../configs/axios-config";

export const getHigherManagerDashboardCardInfo = (divisionId) => {
  if (divisionId) {
    return axiosBackend.get(`/higherManager/division/${divisionId}/cards`);
  }

  return axiosBackend.get(`/higherManager/cards`);
};
