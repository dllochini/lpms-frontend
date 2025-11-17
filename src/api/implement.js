import axiosBackend from "../configs/axios-config";

export const getImplementsByOperation = (operationId) =>
  axiosBackend.get(`implement/${operationId}`);

export default {
  getImplementsByOperation,
};
