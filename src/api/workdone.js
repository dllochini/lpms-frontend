import axiosBackend from "../configs/axios-config";

export const getWorkDoneByTaskId = () => axiosBackend.get("/workDone");

// export const createOperation = (operationData) => axiosBackend.post("/operation", operationData);

// export const getOperationById = (operationId) => axiosBackend.get(`/operation/${operationId}`);

// export const updateOperationById = (operationId, updatedData) =>
//   axiosBackend.put(`/operation/${operationId}`, updatedData);

// export const deleteOperationById = (operationId) => {
//   return axiosBackend.delete(`/operation/${operationId}`);
// };

export default {
  getWorkDoneByTaskId,
//   createOperation,
//   getOperationById,
//   updateOperationById,
//   deleteOperationById,
};
