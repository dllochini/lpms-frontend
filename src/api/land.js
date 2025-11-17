import axiosBackend from "../configs/axios-config";

export const getLands = () => axiosBackend.get("/lands");

export const createUserLand = (formData) => {
  // console.log("Sending formData to backend:", formData);
  return axiosBackend.post("/createUserLand/submit", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getLandsByFieldOfficerId = async (fieldOfficerId) => {
  const result = await axiosBackend.get(
    `/lands/fieldOfficer/${fieldOfficerId}`
  );
  return result.data;
};

export const getLandsByDivId = async (managerId) => {
  const result = await axiosBackend.get(`/lands/manager/${managerId}`);
  return result.data;
};

export const getLandById = (landId) => {
  return axiosBackend.get(`/lands/${landId}`);
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
