import axiosBackend from "../configs/axios-config";

export const getOperations = async () => {
  const res = await axiosBackend.get("/operation");
  return res.data;
};

export const createOperation = (operationData) =>
  axiosBackend.post("/operation", operationData);

export const getOperationById = (operationId) =>
  axiosBackend.get(`/operation/${operationId}`);

export const updateOperationById = (operationId, updatedData) =>
  axiosBackend.put(`/operation/${operationId}`, updatedData);

export const deleteOperationById = (operationId) => {
  // console.log(operationId);
  axiosBackend.delete(`/operation/${operationId}`);
};

export default {
  getOperations,
  createOperation,
  getOperationById,
  updateOperationById,
  deleteOperationById,
};
