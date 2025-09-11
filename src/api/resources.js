import axiosBackend from "../configs/axios-config";

// Get all resources (example: users or resources API)
export const getResources = () => axiosBackend.get("/resource");

// Create a resource
export const createResource = (resourceData) =>
  axiosBackend.post("/resource", resourceData);

// Update a resource
export const updateResourceById = (id, updatedData) =>
  axiosBackend.put(`/resource/${id}`, updatedData);

// Delete a resource
export const deleteResourceById = (id) =>
  axiosBackend.delete(`/resource/${id}`);

export default {
  getResources,
  createResource,
  updateResourceById,
  deleteResourceById,
}