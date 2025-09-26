import axiosBackend from "../configs/axios-config";

export const getLands = () => axiosBackend.get("/lands");

export const createLand = (landData) => axiosBackend.post("/lands", landData);

export const getLandById = (landId) => axiosBackend.get(`/lands/${landId}`);

export const updateLandById = (landId, updatedData) =>
  axiosBackend.put(`/lands/${landId}`, updatedData);

export const deleteLandById = (landId) => {
  return axiosBackend.delete(`/lands/${landId}`);
};

export default {
  getLands,
  createLand,
  getLandById,
  updateLandById,
  deleteLandById,
};
