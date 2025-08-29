import axiosBackend from "../configs/axios-config";

// Get all resources (example: users or resources API)
export const getResources = () => axiosBackend.get("/resources");

// Create a resource
export const createResource = (resourceData) =>
  axiosBackend.post("/resources", resourceData);

// Update a resource
export const updateResourceById = (id, updatedData) =>
  axiosBackend.put(`/resources/${id}`, updatedData);

// Delete a resource
export const deleteResourceById = (id) =>
  axiosBackend.delete(`/resources/${id}`);
