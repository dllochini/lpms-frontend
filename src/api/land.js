import axiosBackend from "../configs/axios-config";

// Get all lands
export const getLands = () => axiosBackend.get("/lands");

// Create a new land
export const createLand = (landData) => axiosBackend.post("/lands", landData);

// Get a land by ID
export const getLandById = (landId) => axiosBackend.get(`/lands/${landId}`);

// Update a land by ID
export const updateLandById = (landId, updatedData) =>
  axiosBackend.put(`/lands/${landId}`, updatedData);

// Delete a land by ID
export const deleteLandById = (landId) => axiosBackend.delete(`/lands/${landId}`);

export default {
  getLands,
  createLand,
  getLandById,
  updateLandById,
  deleteLandById,
};
