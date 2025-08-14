import axiosBackend from "../configs/axios-config";

// Get all operations
export const getOperations = () => axiosBackend.get("/operations");

// Create a new operation
export const createOperation = (operationData) =>
  axiosBackend.post("/operations", operationData);

// Get a single operation by ID
export const getOperationById = (operationId) =>
  axiosBackend.get(`/operations/${operationId}`);

// Update an operation by ID
export const updateOperationById = (operationId, updatedData) =>
  axiosBackend.put(`/operations/${operationId}`, updatedData);

// Delete an operation by ID
export const deleteOperationById = (operationId) =>
  axiosBackend.delete(`/operations/${operationId}`);

export default {
  getOperations,
  createOperation,
  getOperationById,
  updateOperationById,
  deleteOperationById,
};
