import axiosBackend from "../configs/axios-config";

export const getLands = () => axiosBackend.get("/lands");

export const createUserLand = (formData) => axiosBackend.post("/createUserLand/submit", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

export const getLandsByFieldOfficerId = (fieldOfficerId) => { 
  return axiosBackend.get(`/lands/fieldOfficer/${fieldOfficerId}`);
}

export const getLandById = (landId) => {
  return axiosBackend.get(`/lands/${landId}`)
};

export const updateLandById = (landId, updatedData) =>
  axiosBackend.put(`/lands/${landId}`, updatedData);

export const deleteLandById = (landId) => {
  return axiosBackend.delete(`/lands/${landId}`);
};

export default {
  getLands,
  createUserLand,
  getLandById,
  updateLandById,
  deleteLandById,
};
