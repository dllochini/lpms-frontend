import axiosBackend from "../configs/axios-config";

export const getProcessByLandId = async (landId) => {
  if (!landId) console.log("error happened");
  const result = await axiosBackend.get(`/process/${landId}`);
  // console.log(result.data,"in api");
  return result.data;
};

export const updateProcessById = async (processId, updatedData) => {
  if (!processId) throw new Error("processId required");
  const res = await axiosBackend.put(`/process/${processId}`, updatedData);
  return res.data;
};

export const deleteProcessById = (processId) => {
  // console.log(processId, "input");
  return axiosBackend.delete(`/process/${processId}`);
};

export const createProcess = (processData) => {
  return axiosBackend.post("/process", processData);
};
