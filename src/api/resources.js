import axiosBackend from "../configs/axios-config";

export const getResources = async () => {
  const result = await axiosBackend.get("/resource");
  return result.data;
};

export const createResource = (resourceData) =>
  axiosBackend.post("/resource", resourceData);

export const updateResourceById = (id, updatedData) =>
  axiosBackend.put(`/resource/${id}`, updatedData);

export const deleteResourceById = (id) =>
  axiosBackend.delete(`/resource/${id}`);

export default {
  getResources,
  createResource,
  updateResourceById,
  deleteResourceById,
};
