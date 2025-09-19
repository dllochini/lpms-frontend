import axiosBackend from "../configs/axios-config";

// Get all operations
export const getOperations = () => axiosBackend.get("/operation");

// Create a new operation
export const createOperation = (operationData) =>
  axiosBackend.post("/operation", operationData);

// Get a single operation by ID
export const getOperationById = (operationId) =>
  axiosBackend.get(`/operation/${operationId}`);

// Update an operation by ID
export const updateOperationById = (operationId, updatedData) =>
  axiosBackend.put(`/operation/${operationId}`, updatedData);

// Delete an operation by ID
export const deleteOperationById = (operationId) =>
{
    console.log(operationId);
    axiosBackend.delete(`/operation/${operationId}`);
    
}


export default {
  getOperations,
  createOperation,
  getOperationById,
  updateOperationById,
  deleteOperationById,
};
