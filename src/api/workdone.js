import axiosBackend from "../configs/axios-config";

export const getWorkDoneByTaskId = () => axiosBackend.get("/workDone");

export const getAllWorkDone = async () => {
  const result = await axiosBackend.get("/workDone");
  return result.data;
};

export const createWorkDone = (workDoneData) =>
  axiosBackend.post("/workdone", workDoneData);

export const deleteWorkDoneById = (workId) => {
  // console.log(workId, "input");
  return axiosBackend.delete(`/workdone/${workId}`);
};

export default {
  getWorkDoneByTaskId,
  getAllWorkDone,
  createWorkDone,
};
